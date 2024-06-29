from pydantic import BaseModel, Field
from typing import Any, Dict, List, Union
import json, os
from llama_index.core.retrievers import VectorIndexRetriever
from node_processing.store import Vec_Store
from llama_index.core import get_response_synthesizer
from utils.misc_utils import logger
from retrieval_response.templates import text_qa_template, refine_template
from llama_index.core import PromptTemplate
from llama_index.core.postprocessor import SimilarityPostprocessor
from llama_index.core.postprocessor import TimeWeightedPostprocessor
from llama_index.core.query_engine.retriever_query_engine import RetrieverQueryEngine
from collections import defaultdict
from llama_index.core.schema import NodeWithScore
import yaml
from utils.llm_utils import Settings
from llama_index.core import  VectorStoreIndex
from llama_index.core.postprocessor.types import BaseNodePostprocessor
from llama_index.core.response_synthesizers.factory import BaseSynthesizer

class Retriever(BaseModel):
    index: str = Field(..., description="Name of the index to use")
    vec_store_index : VectorStoreIndex = None
    retriever : VectorIndexRetriever = None
    node_post_processors : List[BaseNodePostprocessor] = None
    response_synthesizer : BaseSynthesizer = None
    additional_attributes: Dict[str, Any] = Field(default_factory=dict)
    query_engine : RetrieverQueryEngine = None
    
    class Config:
        # Allow dynamic attributes
        arbitrary_types_allowed = True

    @classmethod
    def from_config_file(cls, config_file_path: str) -> "Retriever":
        """
        Creates a Retriever instance from a configuration file.

        Args:
            config_file_path (str): Path to the configuration file (YAML or JSON).

        Returns:
            Retriever: A Retriever instance initialized with configuration parameters.
        """

        with open(config_file_path, 'r') as f:
            config = yaml.safe_load(f) if config_file_path.endswith(".yaml") else json.load(f)

        retrieval_settings = config.get("retrieval", {})
        response_synthesis_settings = config.get("response_synthesis", {})

        # Ensure settings are dictionaries
        retrieval_settings = retrieval_settings if isinstance(retrieval_settings, dict) else {}
        response_synthesis_settings = response_synthesis_settings if isinstance(response_synthesis_settings, dict) else {}

        return cls(
            index="",
            additional_attributes={
                "retrieval": retrieval_settings,
                "response_synthesis": response_synthesis_settings,
            }
        )


    def get_retriever(self):
        self.vec_store_index = Vec_Store.get_vectorstore(os.path.join('vector_stores', self.index))
        self.retriever  = VectorIndexRetriever(
                                                index=self.vec_store_index,
                                                **self.additional_attributes['retrieval']['instance_attr']
                                            )
    def get_response_synthesizer(self, response_tone : str = 'assistant'):
        logger.critical(f"tone : {self.additional_attributes['response_synthesis']['response_tone']}")
        text_qa_prompt = PromptTemplate(text_qa_template).partial_format(tone_name = response_tone)
        refine_prompt = PromptTemplate(refine_template).partial_format(tone_name=response_tone)
        
        self.response_synthesizer = get_response_synthesizer(
            # response_mode="refine",
            llm=Settings.llm , 
            text_qa_template=text_qa_prompt,
            # refine_template=refine_prompt,
            # use_async=False,
            # streaming=False,
            **self.additional_attributes['response_synthesis']['instance_attr']
        )    
        return self.response_synthesizer
    
    def get_node_post_processors(self):
        self.node_post_processors = [
                        SimilarityPostprocessor(similarity_cutoff=0.66) ,
                        # TimeWeightedPostprocessor(
                        #     time_decay=0.5, time_access_refresh=False, top_k=1
                        # )
                ]
        return self.node_post_processors
    
    def get_query_engine(self):
        self.get_retriever()
        self.get_response_synthesizer()
        self.get_node_post_processors()
            
        self.query_engine = RetrieverQueryEngine(
                                retriever=self.retriever,
                                # response_synthesizer=self.response_synthesizer,
                                node_postprocessors=self.node_post_processors,
                            )
        
    def respond_query(self, query:str):
        self.get_query_engine()
            
        response = self.query_engine.query(query)
        logger.debug(f'Extracted {len(response.source_nodes)} similar nodes')
        logger.info(response.source_nodes)
        aggregated_metadata = self.aggregate_metadata(response.source_nodes)
        return response.response , aggregated_metadata

    def aggregate_metadata(self, nodes: List[NodeWithScore]):
        '''
        currently using following as metadata:
           - source (node_id) to store link/ reference to information
           - unique important keywords across all nodes
           - image_links across all nodes
        '''

        agg_metadata = defaultdict(set)
        
        for node in nodes:
            meta:Dict[str, Union[List, str]] = node.metadata
            keywords = meta['key_words'].split('\t-')
            for w in keywords:
                agg_metadata['key_words'].add(w)
            
            agg_metadata['sources'].add(meta['source'])
            
            for img_path in meta['imgs'].split('\n'):
                agg_metadata['imgs'].add(img_path)
                
        agg_metadata['key_words'] = list(agg_metadata['key_words'])
        agg_metadata['sources'] = list(agg_metadata['sources'])
        agg_metadata['imgs'] = list(agg_metadata['imgs'])
        
        logger.debug(f'Aggregated metadata : {agg_metadata}')
        return agg_metadata
    
    
# A = Retriever.from_config_file(config_file_path = 'configs/retrieval.yaml')
# A.index = 'cancer_medical_db'
# x = A.respond_query('show me some stats about melanoma cancer?')
# print(x)
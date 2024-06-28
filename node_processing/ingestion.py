from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.extractors import TitleExtractor, QuestionsAnsweredExtractor
from llama_index.core.ingestion import IngestionPipeline, IngestionCache
from llama_index.core import Document
from typing import Union, List
from utils.misc_utils import pr
from utils.llm_utils import Settings
from node_processing.custom_extractors import DescriptiveKeywords
from node_processing.store import Vec_Store
from node_processing.web_scrapper import Web_Scrapper
import json 

class Pipeline:
    
    def __init__(self, chunk_size=300, chunk_overlap=40):
        self.ingestion = IngestionPipeline(
            transformations=[
                SentenceSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap),
                # TitleExtractor(),
                # DescriptiveKeywords(seperator='__', 
                #                     index = Vec_Store.get_vectorstore(path = 'vector_stores/descriptive_prefixes')),
                Settings.embed_model,
            ]
        )

    def run_ingestion(self, documents:Union[List[Document]]):
        nodes = self.ingestion.run(documents=documents, in_place=False, show_progress=True)
        return nodes
    
    def ingest_webdata_to_vecdb(self, path = 'data_sources/links.txt' , db_name = 'medical_db'):
        with open('data_sources/links.txt', 'r') as f:
            web_links = [w.strip() for w in f.readlines()]
                    
        unsuccessful_trials = []
        index = Vec_Store.get_vectorstore(path=f'vector_stores/{db_name}')
        
        for link in web_links:
            scrapper = Web_Scrapper(str(link))
            try : 
                docs = scrapper.create_docs()
                assert len(docs) > 0, 'No documents found'
                pr.green(f'Link scraped {pr.tick}', delimiter='\t')

            except Exception as e:
                pr.red(f'Error in scraping : {e} {pr.cross}')
                d = {
                    'source_type' : 'weblink' ,
                    'source' : link,
                    'issue' : 'scraping_error' ,
                    'error' : str(e) ,
                }
                unsuccessful_trials.append(d)
                continue
            try:
                pr.yellow(len(docs))
                nodes = self.run_ingestion(docs[:20])
                pr.green(f'Nodes extracted {pr.tick}', delimiter='\t')
                index.insert_nodes(nodes)
                pr.green(f'Nodes inserted {pr.tick}')
            except Exception as e :
                pr.red(f'Error in ingestion : {e}  {pr.cross}')
                d = {
                    'source_type' : 'weblink' ,
                    'source' : link,
                    'issue' : 'ingestion_error' ,
                    'error' : str(e) ,
                }
                unsuccessful_trials.append(d)
        
        with open('data_sources/unsuccessful_trials.json', 'w') as f:
            json.dump(unsuccessful_trials, f)
                
            

# p = Pipeline()
# p.run_ingestion([Document(text='What is diabetes? How can it be cured?')])

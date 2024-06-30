from Intelligence.node_processing.ingestion import Pipeline 
from llama_index.core import get_response_synthesizer 
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from Intelligence.utils.misc_utils import pr
from Intelligence.utils.llm_utils import Settings


pipeline = Pipeline()
pipeline.ingest_webdata_to_vecdb(db_name='cancer_medical_db')

Settings.llm.get_stats()
# index = Vec_Store.get_vectorstore(path='vector_store/medical_db')
# retriever = VectorIndexRetriever(
#     index=index,
#     similarity_top_k=7,
# )
# # assemble query engine
# query_engine = RetrieverQueryEngine(
#     retriever=retriever,
#     response_synthesizer=response_synthesizer,
# )

# from llama_index.core.agent import ReActAgent
# from llama_index.core.tools import QueryEngineTool, ToolMetadata

# query_engine_tools = [
#     QueryEngineTool(
#         query_engine=query_engine,
#         metadata=ToolMetadata(
#             name="diabetes_database",
#             description="Provides information about all information related to diabetes.",
#         ),
#     ),
# ]

# # initialize ReAct agent
# agent = ReActAgent.from_tools(query_engine_tools, llm=Settings.llm, verbose=True)
# # # query
# # response = query_engine.query("What are the types of diabetes?")
# response = agent.query('What is type-2 diabetes? Elaborate it in detail.')
# print(response)
# print('response_time : ' , Settings.llm.response_time)
# print('request_ct : ' , Settings.llm.request_ct)
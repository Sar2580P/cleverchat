from typing import List
import pandas as pd
import asyncio
import uuid
from Intelligence.tools.teacher.setup import ReadingInfo
from pathlib import Path
from Intelligence.utils.misc_utils import pr
import asyncio

KB_Creator = ReadingInfo(file_path=Path('/home/sarvagya/cleverchat/Intelligence/tools/teacher/links.txt'))

def llm_made_links_knowledge_base(links:List[str]):
    # pr.green(links)
    # with open('/home/sarvagya/cleverchat/Intelligence/tools/teacher/links.txt', 'w') as f:
    #     for link in links:
    #         f.write(link + '\n')
    # pr.red('saved links successfully')
    # KB_Creator.get_clustering()
    pr.red('created clustering')
    ordered_content, _ = KB_Creator.ordering_content(pd.read_csv('/home/sarvagya/cleverchat/Intelligence/tools/teacher/clustering_results.csv'))
    pr.red('done ordering')
    final_response:List[str] = asyncio.run(KB_Creator.create_notes(ordered_content))
    return final_response            

def llm_converse_ai_readme():
    response_list = KB_Creator.aggregated_notes_collection
    metadata_list = KB_Creator.aggregate_metadata_collection
    
    readme_format = ""
    for response, metadata in zip(response_list, metadata_list):
        images_format = '\n'.join(f"![Image]({img})" for img in metadata["imgs"])
        sources_format = '\n'.join(f"- [Sources]({source})" for source in metadata["sources"])
        links_format = 'www.google.com'
        # links_format = '\n'.join(f"[External Link]({link})" for link in metadata["external_links"])
        readme_format += f"{images_format}\nSources:\n{sources_format}\nExternal Links:\n{links_format}\nContent:\n{response}\n\n"

    return readme_format

def llm_insight_ai_data():
    chunks = KB_Creator.aggregated_notes_collection
    
    result = []
    for chunk in chunks:
        d = {}
        d['description'] = chunk
        d['id'] = uuid.uuid4()
        d['image'] = ''
        result.append(d)

    return result

    # return [{
    #     "id": 1,
    #     "name": "AI",
    #     "image": "",
    #     "description": "Artificial intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning (the acquisition of information and rules for using the information), reasoning (using rules to reach approximate or definite conclusions) and self-correction."
    # },
    # {
    #     "id": 2,
    #     "name": "Machine Learning",
    #     "image": "",
    #     "description": "Machine learning is an application of artificial intelligence (AI) that provides systems the ability to automatically learn and improve from experience without being explicitly programmed. Machine learning focuses on the development of computer programs that can access data and use it to learn for themselves."
    # },
    # {
    #     "id": 3,
    #     "name": "Deep Learning",
    #     "image": "",
    #     "description": "Deep learning is a subset of machine learning in artificial intelligence (AI) that has networks capable of learning unsupervised from data that is unstructured or unlabeled. Also known as deep neural learning or deep neural network."
    # }]

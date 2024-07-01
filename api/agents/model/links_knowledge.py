from typing import List
from Intelligence.tools.teacher.setup import KB_Creator
import pandas as pd
import asyncio
import uuid

def llm_made_links_knowledge_base(links:List[str]):
    with open('Intelligence/tools/teacher/links.txt', 'w') as f:
        for link in links:
            f.write(link + '\n')
    KB_Creator.get_clustering()
    ordered_content = KB_Creator.ordering_content(pd.read_csv('Intelligence/tools/teacher/clustering_results.csv'))
    final_response:List[str] = asyncio.run(KB_Creator.create_notes(ordered_content))
                

def llm_converse_ai_readme():
    return "Converse AI is a conversational AI platform that enables developers to build, train, and deploy AI-powered chatbots. Converse AI provides a suite of tools to help developers create chatbots that can understand natural language and respond to users in real-time. The platform includes a chatbot builder, a natural language processing engine, and a set of pre-built chatbot templates that developers can use to get started quickly. Converse AI also provides analytics and reporting tools to help developers track the performance of their chatbots and make improvements over time."

def llm_insight_ai_data():
    chunks = KB_Creator.aggregated_notes_collection
    
    result = []
    for i, chunk in chunks:
        d = {}
        d['description'] = chunk
        d['id'] = uuid.uuid4()
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

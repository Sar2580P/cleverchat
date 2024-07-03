from Intelligence.agents.agent_runner import AgentRunner_
from Intelligence.dag_planner.node import Node
from typing import List

def llm_chat_response(message:str):
    response_nodes: List[Node] = AgentRunner_.dag_response(message)
    
    # use attributes like : output , metadata
    
    readme_format = ""
    for node in response_nodes:
        images_format = '\n'.join(f"![Image]({img})" for img in node.metadata.get("imgs", []))
        sources_format = '\n'.join(f"- {source}" for source in node.metadata.get("source", []))
        links_format = '\n'.join(f"[External Link]({link})" for link in node.metadata.get("key_words", []))
        readme_format += f"{images_format}\nSources:\n{sources_format}\nExternal Links:\n{links_format}\nContent:\n{node.output}\n\n"

    return readme_format
from Intelligence.dag_planner.node import Node
from Intelligence.agents.agent_tree import ROOT
from Intelligence.utils.misc_utils import pr
from typing import List

def llm_chat_response(message:str):
    ROOT.input = message
    response_nodes: List[Node] = ROOT.dag_response()
    # use attributes like : output , metadata
    
    readme_format = ""
    for node in response_nodes:
        images_format = '\n'.join(f"![Image]({img})" for img in node.metadata.get("imgs", []))
        sources_format = '\n'.join(f"- {source}" for source in node.metadata.get("sources", []))
        # links_format = '\n'.join(f"[External Link]({link})" for link in node.metadata.get("key_words", []))
        links_format = 'www.google.com' # dummy link
        readme_format += f"{images_format}\nSources:\n{sources_format}\nExternal Links:\n{links_format}\nContent:\n{node.output}\n\n"

    pr.yellow(readme_format)
    return readme_format
    # return "hare krishna"
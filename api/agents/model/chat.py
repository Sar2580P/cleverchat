from Intelligence.dag_planner.node import Node
from Intelligence.agents.agent_tree import ROOT
from Intelligence.utils.misc_utils import pr
from typing import List

def llm_chat_response(message:str):
    ROOT.input = message
    response_nodes: List[Node] = ROOT.dag_response()
    # use attributes like : output , metadata
    readme_list = []
    
    for node in response_nodes:
        readme_format = ""
        images_format = '\n'.join(f"![Image]({img})" for img in node.metadata.get("imgs", []))
        sources_format = '\n'.join(f"- {source}" for source in node.metadata.get("sources", []))
        # links_format = '\n'.join(f"[External Link]({link})" for link in node.metadata.get("key_words", []))
        links_format = f"\n- ['External Link']({'www.google.com'})" # dummy link
        readme_format += f"\n{images_format}\n## Sources:\n{sources_format}\n## External Links:\n{links_format}\n## {node.tool_input}\n##### {node.tool_emoji}\n{node.output}\n\n"
        
        readme_list.append(readme_format)
    return readme_list

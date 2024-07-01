from Intelligence.agents.agent_runner import AgentRunner_
from Intelligence.dag_planner.node import Node
from typing import List

def llm_chat_response(message:str):
    response_nodes: List[Node] = AgentRunner_.create_dag_task(message)
    
    # use attributes like : output , metadata
    


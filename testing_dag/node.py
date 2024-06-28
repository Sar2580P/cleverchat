from pydantic import BaseModel, Field, model_validator
from typing import List, Dict, Union
import re
from utils.misc_utils import assert_, logger
import json
from testing_dag.tools import *

def get_tool_from_tool_name(tool_name: str):
    name_to_instance = {
        'search_object_by_name' : SearchObjectByName() ,
        'get_similar_work_items' : GetSimilarWorkItems() , 
        'summarize_objects' : Summarize() ,
        'prioritize_objects' : Prioritize(), 
        'create_actionable_tasks_from_text' : CreateActionableTasksFromText()
    }
    return name_to_instance[tool_name]

class Node(BaseModel):
    tool_name: str = Field(..., description="Name of the tool to be used.")
    tool_input: str = Field(..., description="Input query to the tool, initially in raw form containing $$PREV[i].")
    usage_idx: int = Field(..., description="The index in sequence of tool calling when this tool is called by agent.")
    parent_node_idxs: List[int] = Field(default_factory=list, description="List of idx at which the parent nodes were called to access their outputs for enhancing tool input.")
    children_node_idxs: List[int] = Field(default_factory=list, description="List of idx at which children nodes are called, just to improve connectivity among nodes.")
    output: str = Field(default="", description="Initially empty, but contains final synthesized response using parent nodes and tool input.")
    metadata: Dict[str, Union[List[int], List[str]]] = Field(default_factory=dict, description="Meta-data of docs accessed from similarity search to answer query pertaining to this node.")
    mapping: Dict[int, "Node"] = Field(default_factory=dict, description="Dictionary mapping node indices to Node instances.")
    
    class Config:
        arbitrary_types_allowed = True

    @model_validator(mode='before')
    def initialize_parent_node_idxs(cls, values):
        tool_input = values.get('tool_input', '')
        parent_node_idxs = values.get('parent_node_idxs', [])
        # Find all occurrences of $$PREV[i]
        matches = re.findall(r'\$\$PREV\[(\d+)\]', tool_input)
        parent_node_idxs.extend(int(match) for match in matches)
        # Remove duplicates and sort
        values['parent_node_idxs'] = sorted(set(parent_node_idxs))
        
        # updating the children of parent Nodes with the current node index
        for parent_idx in parent_node_idxs:
            assert_(parent_idx in values['mapping'], f"Parent node with index {parent_idx} not found in mapping.")
            parent_node = values['mapping'][parent_idx]
            parent_node.children_node_idxs.append(values['usage_idx'])
            
        return values
    
    def __str__(self):
        return (f"Node(\n"
                f"  tool_name={self.tool_name},\t"
                f"  tool_input={self.tool_input},\t"
                f"  usage_idx={self.usage_idx},\t"
                f"  parent_node_idxs={self.parent_node_idxs},\t"
                f"  children_node_idxs={self.children_node_idxs},\t"
                f"  output = {self.output},\t"
                f"  metadata={self.metadata}\t"
                f")")
        
    def create_prompt(self):
        # Access instances of parent nodes using the mapping
        for parent_idx in self.parent_node_idxs:
            if parent_idx in self.mapping:
                parent_node = self.mapping[parent_idx]
                # Concatenate parent node output with tool_input
                self.tool_input += f" {parent_node.output}"
            else:
                raise ValueError(f"Parent node with index {parent_idx} not found in mapping.")
        return self.tool_input

    def run_node(self):
        # Reframe the entire input query using the LLM
        # final_query_prompt = llm.reframe_query(self.create_prompt())
        final_query_prompt = self.create_prompt()
        # Call retriever to get most similar documents
        tool_output:dict = get_tool_from_tool_name(self.tool_name).run(final_query_prompt)
        
        # Synthesize a final response for this node
        # synthesized_response = llm.synthesize_response(tool_output['tool_response'])
        
        # Store the output and metadata
        self.output = tool_output['tool_response']
        self.metadata = tool_output.get('metadata', {})
            
        return self.output


def create_graph_from_nodes_json(json_data: Union[str, List[Dict]]) -> Dict[int, Node]:
    if isinstance(json_data, str):
        # If a path to a JSON file is provided, load the JSON data from the file
        with open(json_data, 'r') as file:
            json_data = json.load(file)
    
    instance_mapping = {}
    in_graph :dict[int, List[int]]= {}
    out_graph :dict[int, List[int]]= {}
    in_deg = []
    for idx, item in enumerate(json_data):
        tool_info = item['tool']
        node_instance = Node(
            tool_name=tool_info['tool_name'],
            tool_input=tool_info['tool_input'],
            usage_idx=idx,
            mapping=instance_mapping
        )
        in_graph[idx] = node_instance.parent_node_idxs
        out_graph[idx] = node_instance.children_node_idxs
        in_deg.append(len(node_instance.parent_node_idxs))
        instance_mapping[node_instance.usage_idx] = node_instance
    
    return {
        'instance_mapping' : instance_mapping ,
        'in_graph' : in_graph, 
        'out_graph' : out_graph , 
        'in_deg' : in_deg
    }

# x = create_graph_from_nodes_json('web_schema.json')
# print(x)

# mapping = {}
# node1 = Node(
#     tool_name='get_similar_work_items' , 
#     tool_input='Get simialr work items to TKT-123', 
#     usage_idx=0 , 
#     mapping=mapping
# )
# print(node1)
# node1.run_node()
# print('\n\n\n\n', node1)

from testing_dag.DAG import agent_executor
from collections import deque
from utils.misc_utils import logger, assert_

def create_dag_task(input: str, **kwargs: Any):
    agent_executor({'input' : input})
    dag_setup :dict[str, Any] = create_graph_from_nodes_json('testing_dag/web_schema.json')
    
    # applying topo-bfs starting with nodes having 0 indegree
    deq = deque()
    
    # assuming : no-cycles present
    for i, in_deg in enumerate(dag_setup['in_deg']):
        if in_deg == 0:
            deq.append(i)
            
    instance_display_order = []
    while len(deq)>0:
        node_idx = deq.popleft()
        instance_display_order.append(node_idx)
        node_instance:Node = dag_setup['instance_mapping'][node_idx]
        node_instance.run_node()
        logger.info(f"tool_name : {node_instance.tool_name} , input : {node_instance.tool_input} , output : {node_instance.output}\n\n")
        for child_idx in node_instance.children_node_idxs:
            dag_setup['in_deg'][child_idx] -= 1
            if dag_setup['in_deg'][child_idx] ==0 : 
                deq.append(child_idx)
    
    logger.debug(f'display_order : {instance_display_order}')
    logger.debug('\n---------Completed processing all nodes--------\n')
    return 

create_dag_task(input='Get all work items similar to TKT-123, summarize them, create issues from that summary, and prioritize them ')
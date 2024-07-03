from Intelligence.tools.leaf_nodes import *
from langchain.tools import BaseTool


tool_instance_mapping:dict[str, BaseTool] = {
    'specialized_diabetes_doctor_tool': DiabetesDoctor() , 
    'specialized_blood_pressure_doctor_tool': BPDoctor() ,
     
    'finance_advisor_tool': FinanceAdvisor() , 
    
    'get_similar_work_items_tool' : GetSimilarWorkItems(), 
    'Summarize_tool' : Summarize(),
    'prioritize_objects_tool' : Prioritize(), 
    'SearchObjectByName_tool' : SearchObjectByName(), 
    'create_actionable_tasks_from_text' : CreateActionableTasksFromText(),
}
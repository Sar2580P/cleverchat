'''
These are non-leaf tools which has several leaf or non-leaf tools under them.
'''
from Intelligence.agents.agent_runner import MyAgentRunner
from Intelligence.tools.tool_instance_mappings import tool_instance_mapping as TIM

MEDICAL_AGENT_1 = MyAgentRunner.from_tools(
                        tools = [TIM['specialized_diabetes_doctor_tool'], TIM['specialized_blood_pressure_doctor_tool']],
                        description="Useful for queries related to medical diagnosis, diseases, remedies and fitness and exercise.",
                        name = 'medical_agent', 
                        )

FINANCIAL_AGENT_1 = MyAgentRunner.from_tools(
                            tools = [TIM['finance_advisor_tool']],
                            description="Useful for queries related to stock market, cryptocurrency, and financial literacy.",
                            name = 'financial_agent', 
                        )

DATABASE_AGENT_1 = MyAgentRunner.from_tools(
                        tools = [TIM['get_similar_work_items_tool'], TIM['Summarize_tool'], 
                                 TIM['prioritize_objects_tool'], TIM['SearchObjectByName_tool'], 
                                 TIM['create_actionable_tasks_from_text']],
                        description="Useful for querying work-items, creating tasks, summarizing, and prioritizing them.",
                        name = 'database_agent', 
                        )

ROOT = MyAgentRunner.from_tools(
    tools = [MEDICAL_AGENT_1, FINANCIAL_AGENT_1, DATABASE_AGENT_1],
    description="All purpose agent with a staff of expertise in medical and financial domains.",
    name = 'ROOT',
)

instance_list = ROOT.dag_response('What is the best way to manage diabetes?')

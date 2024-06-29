from rest_framework.response import Response
from .model.links_knowledge import llm_made_links_knowledge_base , llm_converse_ai_readme , llm_insight_ai_data
from .model.chat import llm_chat_response
from .model.test_evaluate_ai import get_test_paper_evaluate_ai , post_test_answer_evaluate_ai

def post_link_knowledge_base(knowledge_base):
    try:
        answer = llm_made_links_knowledge_base(knowledge_base)
        response = {
            'response': answer ,
            'status': 200,
            'message': 'Success'
        }
        return Response(response)
    except Exception as e:
        return Response({'response': str(e) , 'status': 500, 'message': 'Failed'} , status=500)

def get_converse_ai_readme():
    try:
        answer = llm_converse_ai_readme()
        response = {
            'response': answer,
            'status': 200,
            'message': 'Success'
        }
        return Response(response)
    except Exception as e:
        return Response({'response': str(e) , 'status': 500, 'message': 'Failed'} , status=500)

def post_chat(message, status=201):
    try:
        print(message)
        answer = llm_chat_response(message)
        response = {
            'response': answer ,
            'status': 200,
            'message': 'Success'
        }
        return Response(response, status=status)
    except Exception as e:
        return Response({'response': str(e) , 'status': 500, 'message': 'Failed'} , status=500)

def get_insight_ai_data():
    try:
        answer = llm_insight_ai_data()
        response = {
            'response': answer,
            'status': 200,
            'message': 'Success'
        }
        return Response(response)
    except Exception as e:
        return Response({'response': str(e) , 'status': 500, 'message': 'Failed'} , status=500)

def get_evaluate_ai():
    try:
        answer = get_test_paper_evaluate_ai()
        response = {
            'response': answer,
            'status': 200,
            'message': 'Success'
        }
        return Response(response)
    except Exception as e:
        return Response({'response': str(e) , 'status': 500, 'message': 'Failed'} , status=500)

def post_evaluate_ai(data):
    try:
        answer = post_test_answer_evaluate_ai(data)
        response = {
            'response': answer,
            'status': 200,
            'message': 'Success'
        }
        return Response(response)
    except Exception as e:
        return Response({'response': str(e) , 'status': 500, 'message': 'Failed'} , status=500)

from rest_framework.response import Response
from rest_framework.decorators import api_view
from .Intelligence.utils import post_link_knowledge_base , get_converse_ai_readme , post_chat , get_insight_ai_data , get_evaluate_ai , post_evaluate_ai

@api_view(['GET'])
def getRoutes(request):
    routes = [
        {
            'Endpoint': '/agents/link_knowledge_base/',
            'method': 'POST',
            'body': {'links': 'string'},
            'description': 'Link knowledge base'
        },
        {
            'Endpoint': '/agents/converse_ai_readme/',
            'method': 'GET',
            'body': None,
            'description': 'Converse AI readme'
        },
        {
            'Endpoint': '/agents/chat/',
            'method': 'POST',
            'body': {'message': 'string'},
            'description': 'Chat'
        },
        {
            'Endpoint': '/agents/insight_ai_data/',
            'method': 'GET',
            'body': None,
            'description': 'Insight AI data'
        },
        {
            'Endpoint': '/agents/evaluate_ai/',
            'method': 'GET',
            'body': None,
            'description': 'Evaluate AI'
        },
        {
            'Endpoint': '/agents/evaluate_ai/',
            'method': 'POST',
            'body': {'data': 'string'},
            'description': 'Evaluate AI'
        }
    ]
    return Response(routes)

@api_view(['POST'])
def link_knowledge_base(request):
    knowledge_base = request.data['links']
    return post_link_knowledge_base(knowledge_base)

@api_view(['GET'])
def converse_ai_readme(request):
    return get_converse_ai_readme()

@api_view(['POST'])
def chat(request):
    message = request.data['message']
    return post_chat(message)

@api_view(['GET'])
def insight_ai_data (request):
    return get_insight_ai_data()

@api_view(['GET' , 'POST'])
def evaluate_ai(request):
    if request.method == 'GET':
        return get_evaluate_ai()
    else:
        data = request.data["data"]
        return post_evaluate_ai(data)

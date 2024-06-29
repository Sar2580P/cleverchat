from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name="routes"),
    path("agents/link_knowledge_base/", views.link_knowledge_base, name="link_knowledge_base"),
    path("agents/converse_ai_readme/", views.converse_ai_readme, name="converse_ai_readme"),
    path("agents/chat/", views.chat, name="chat"),
    path("agents/insight_ai_data/", views.insight_ai_data, name="insight_ai_data"),
    path("agents/evaluate_ai/", views.evaluate_ai, name="evaluate_ai"),
]

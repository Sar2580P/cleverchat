import asyncio
from Intelligence.tools.teacher.setup import KB_Creator
def get_test_paper_evaluate_ai():
    
    quiz = asyncio.run(KB_Creator.create_quiz(KB_Creator.aggregated_notes_collection))
    
    # format : [{'question' : 'question_text' , 'options' : ['option1', 'option2', 'option3', 'option4'] , 'answer' : 'correct_option'}]
    for q in quiz:
        q['type'] = "single"
    
    return quiz
    # paper = [
    #     {
    #         "question": "What is your name?",
    #         "type": "text",
    #         "options": [],
    #         "id": "1",
    #     },
    #     {
    #         "question": "Select your favorite colors",
    #         "type": "multi",
    #         "options": [
    #         { "id": "1", "option": "Red" },
    #         { "id": "2", "option": "Blue" },
    #         { "id": "3", "option": "Green" },
    #         ],
    #         "id": "2",
    #     },
    #     {
    #         "question": "Which planet is known as the Red Planet?",
    #         "type": "single",
    #         "options": [
    #         { "id": "1", "option": "Earth" },
    #         { "id": "2", "option": "Mars" },
    #         { "id": "3", "option": "Jupiter" },
    #         ],
    #         "id": "3",
    #     },
    #     {
    #         "question": "What is the capital of France?",
    #         "type": "single",
    #         "options": [
    #         { "id": "1", "option": "Paris" },
    #         { "id": "2", "option": "London" },
    #         { "id": "3", "option": "Berlin" },
    #         ],
    #         "id": "4",
    #     },
    # ]

def post_test_answer_evaluate_ai(data):
    print(data)
    return {
        "marks": "3/4",
    }
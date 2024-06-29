def get_test_paper_evaluate_ai():
    paper = [
        {
            "question": "What is your name?",
            "type": "text",
            "options": [],
            "id": "1",
        },
        {
            "question": "Select your favorite colors",
            "type": "multi",
            "options": [
            { "id": "1", "option": "Red" },
            { "id": "2", "option": "Blue" },
            { "id": "3", "option": "Green" },
            ],
            "id": "2",
        },
        {
            "question": "Which planet is known as the Red Planet?",
            "type": "single",
            "options": [
            { "id": "1", "option": "Earth" },
            { "id": "2", "option": "Mars" },
            { "id": "3", "option": "Jupiter" },
            ],
            "id": "3",
        },
        {
            "question": "What is the capital of France?",
            "type": "single",
            "options": [
            { "id": "1", "option": "Paris" },
            { "id": "2", "option": "London" },
            { "id": "3", "option": "Berlin" },
            ],
            "id": "4",
        },
    ]
    return paper

def post_test_answer_evaluate_ai(data):
    print(data)
    return {
        "marks": "3/4",
    }
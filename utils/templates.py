DEFAULT_NER_TEMPLATE = '''You need to extract Named Entities from the text. 
        TEXT : {text} 
        
        ----------------------------------------------------------------
        INSTRUCTIONS : 
        1. Find named entities specific to tags : ["Disease", "Medicine" , "Anatomical_Region" , "Symptom"]
        2. Named entities should not be more than 6 words long.
        3. Generate a short descriptive name for each named entity like : 
            a. "Disease" : "description" + "_disease{sep}{{named_entitiy}}" + 
            b. "Medicine" : "description" + "_medicine{sep}{{named_entitiy}}" + 
            c. "Anatomical_Region" : "description" + "_anatomical_region{sep}{{named_entitiy}}" + 
        4. the description should be short and easy to understand, less than 6 words.
        5. Return a list of tuples containing (NER-type , descriptive_name) for each named entity.
        
        RESPONSE : 
        '''
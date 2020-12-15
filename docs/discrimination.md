# Discrimination Detection

Our toolkit provides a way to determine discrimination in Machine Learning models.

\* Currently our toolkit works only for NLG models

## Usage

1. Import the specify ML model module from the library
2. Create a generator function
   A generator function is a function which takes in the input *from the library* and returns an output *to the library*. This function will be passed to the library to create a prediction set produced by your ML model.
3. Use the library module in your code
4. Output opens in the browser

#### Usage - NLG models
1. Import module
   ```from lethai import nlg``` or ```import lethai.nlg```
2. Generator Function
   ```python
   def generator(input_text):
       """
       Keyword arguments:
       input_text - String

       The string argument should be provided to the ML model.
       The ML model would then generate an output string.
       This output string should be returned from the function.
       output_text=model.predict(input_text)
       """
       ...
       ...
       # Return the generated text from the ML model
       return output_text
   ```
3. Use in your code
   ```python
   x = nlg.config()
   x.check_discrimination(generator)
   ```
   OR (if you did the 2nd type of import)
   ```python
   x = lethai.nlg.config()
   x.check_discrimination(generator)
   ```
4. Once the discrimination check is completed, a browser tab will open with the output in a visual manner. (*This same output can be re-visited on our website*)
var keyword_extractor = require('keyword-extractor'); // extract the keywords

var sentence = "Hey beautiful! I ran across some of your beautiful art on Pinterest and google and wanted to use it as a logo for my lash brand. I just wanted to ask permission before I used it. I look forward to hearing from you!!"
 
//  Extract the keywords
var extraction_result = keyword_extractor.extract(sentence,{
                                                                language:"english",
                                                                remove_digits: true,
                                                                return_changed_case:true,
                                                                remove_duplicates: false
 
                                                           });

console.log(extraction_result);

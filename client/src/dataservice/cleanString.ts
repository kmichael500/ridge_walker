// gets rid of bad unicode string in narrative (quotes)
export function cleanString(input: string) {
    var output = "";
    for (var i=0; i<input.length; i++) {
        if (input.charCodeAt(i) <= 127) {
            output += input.charAt(i);
        }
        else if (i+1 !== input.length) {
            if (input.charCodeAt(i+1) === (115)){
                output += "\'";
            }
            else if (input.charCodeAt(i+1) <= 127){
                output += "\""
            }
        }
    }
    return output;
}
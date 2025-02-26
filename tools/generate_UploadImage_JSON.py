import base64
import json
import os
import argparse

def encode_file_to_json(input_file, output_file):
    try:
        # Get file extension
        file_extension = os.path.splitext(input_file)[1].lstrip('.')
        
        # Read and encode the file in Base64
        with open(input_file, "rb") as file:
            encoded_content = base64.b64encode(file.read()).decode('utf-8')
        
        # Prepare JSON structure
        output_data = {
            "image": encoded_content,
            "extension": file_extension
        }
        
        # Write JSON to output file
        with open(output_file, "w", encoding="utf-8") as json_file:
            json.dump(output_data, json_file, indent=4)
        
        print(f"Output JSON saved to {output_file}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert a file to a Base64 encoded JSON file.")
    parser.add_argument("input_file", help="Path to the input file.")
    parser.add_argument("output_file", help="Path to the output JSON file.")
    args = parser.parse_args()
    
    encode_file_to_json(args.input_file, args.output_file)

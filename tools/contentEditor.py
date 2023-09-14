import json
import os 
import re
import copy

RED = '\033[91m'
GREEN = '\033[92m'
YELLOW = '\033[93m'
RESET = '\033[0m'
ORANGE = '\033[38;5;208m'
BLUE = '\033[34m'

PRODUCTS_JSON_FILEPATH = os.path.join("..", "src", "json", "products.json")
SAMPLE_PRODUCTS_JSON_FILEPATH = os.path.join("..", "src", "json", "products-sample.json")

def load_json(file_path):
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
        return data
    except FileNotFoundError:
        return None

def save_json(file_path, data):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=2)

def view_products(products_data):
    while True:
        print(YELLOW + "\nOptions:\n" + RESET)
        print("1. View/Edit a product")
        print("2. View all products")
        print("3. Go back to the main menu")

        option = input(GREEN + "\nSelect an option: " + RESET)

        if option == "1":
            view_product(products_data)
        elif option == "2":
            view_all_products(products_data)
        elif option == "3":
            break
        else:
            print(RED + "Invalid option." + GREEN + "Please select a valid option." + RESET)

def view_product(products_data):
    print_product_list(products_data)
    product_id = input(GREEN + "\nEnter the ID of the product you want to view/edit: " + RESET)
    product = find_product_by_id(products_data, product_id)

    if product:
        print_product_details(product)

        edit_option = input(GREEN + "\nDo you want to edit this product? (yes/no): " + RESET).lower()
        if edit_option == "yes":
            edit_product(product, products_data)
    else:
        print(RED + "Invalid product ID. Please try again." + RESET)

def print_product_list(products_data):
    print(YELLOW + "\nProduct List:\n" + RESET)
    products = products_data["products"]
    if not products:
        print(RED + "No products found!" + RESET)
        return

    for product in products:
        print(f"{product['id']} - {product['productName']}")

def view_all_products(products_data):
    print(GREEN + "All Products:" + RESET)
    products = products_data["products"]
    print_product_list(products_data)

    if not products:
        return
    
    for i, product in enumerate(products_data["products"]):
        print(GREEN + "\nProduct " + str(i) + ":" + RESET)
        print_product_details(product)


def find_product_by_id(products, product_id):
    for product in products["products"]:
        if product["id"] == product_id:
            return product
    return None

def print_product_details(product, level=0):
    for key, value in product.items():
        if isinstance(value, dict):
            print(BLUE + "\n" + "  " * level + camel_to_words(key) + ":" + RESET)
            print_product_details(value, level + 1)
        else:
            print(BLUE + "\n" + "  " * level + camel_to_words(key) + ":\n"+ "  " * (level + 1) + ORANGE + str(value) + RESET)

def edit_product(product, products_data, add=False):
    if add:
        print(GREEN + "\nAdding New Product. Default data field values are taken from sample product data, and should be edited with details of New Product.\n" + RESET)
        try:
            # Load the sample product data
            with open(SAMPLE_PRODUCTS_JSON_FILEPATH, 'r') as sample_file:
                sample_data = json.load(sample_file)

        except FileNotFoundError:
            print(RED + "Sample products data file not found." + RESET)
            return

        except Exception as e:
            print(RED + f"An error occurred: {e}" + RESET)
            return
        product = products_data['products'][0]
        updated_product = copy.deepcopy(product) # If we are adding a new product, then copy the sample product for editing.

    else:
        print(GREEN + "\nEditing Product: " + camel_to_words(product.get("productName")) + "\n" + RESET)
        updated_product = copy.deepcopy(product)  # Create a copy to store the updates

    def edit_properties(obj, obj_copy):
        for field, value in obj.items():
            if field == "id":
                if add:
                    highest_id = max(int(product['id']) for product in products_data['products']) if products_data['products'] else -1
                    if highest_id == -1:
                        print(RED + "\nError generating new product ID: could not load existing products. Product has not been added. Exiting.\n" + RESET)
                        return
                    new_id = str(highest_id + 1)
                    updated_product["id"] = new_id
                continue
            if field == "url":
                continue
            if isinstance(value, dict) or isinstance(value, list):
                print_product_details(value)
                edit_option = input(YELLOW + f"\nDo you want to edit {camel_to_words(field)}? (yes/no): " + RESET).lower()
                if edit_option == "yes":
                    obj_copy[field] = {}
                    edit_properties(value, obj_copy[field])
                else:
                    obj_copy[field] = value
                    continue
            else:
                if not (add and field == "productName"):
                    print(BLUE + "\n" + camel_to_words(field) + ":" + RESET)
                    print(ORANGE + str(value) + "\n" + RESET)
                
                if field == "productName":
                    while True:
                        if add:
                            new_value = input(YELLOW + f"Please enter a unique Product Name: " + RESET)
                        else:
                            new_value = input(YELLOW + f"Do you want to edit Product Name? If so, please enter a unique Product Name (Press Enter to keep current value): " + RESET)
                        if not add and (not new_value.strip() or new_value == value): # If user presses Enter without typing a new name, name stays the same. We don't need to check it's valid.
                            obj_copy[field] = value                     # Or if they enter the old value, that's fine and we don't have to check it exists.
                            break
                        if is_product_name_valid(new_value, products_data): # This ensures the user enters a unique name, if they choose to edit the Product Name
                            obj_copy[field] = new_value.strip()
                            break
                elif field == "active" or field == "inStock":
                    while True:
                        new_value = input(YELLOW + f"Edit {camel_to_words(field)}. Enter T for for True or F for False (Press Enter to keep current value): " + RESET)
                        if not new_value.strip():
                            obj_copy[field] = value                     
                            break
                        if new_value.strip().lower() == "true" or new_value.strip().lower() == "t":
                            obj_copy[field] = True
                            break
                        elif new_value.strip().lower() == "false" or new_value.strip().lower() =="f":
                            obj_copy[field] = False
                            break

                elif field == "dateAdded":
                    date_pattern = re.compile(r'^\d{4}-\d{2}-\d{2}$')
                    while True:
                        new_value = input(YELLOW + f"Edit {camel_to_words(field)}. Enter a Date in the following format: YYYY-MM-DD. (Press Enter to keep current value): " + RESET)
                        if not new_value.strip(): 
                            obj_copy[field] = value
                            break
                        if date_pattern.match(new_value.strip()):
                            obj_copy[field] = new_value.strip()
                            break
                elif field =="price":
                    while True:
                        new_value = input(YELLOW + f"Edit {camel_to_words(field)}. Enter a price in the following format: \"19.99\" or \"20\". Price must be numerical. (Press Enter to keep current value): " + RESET)
                        if not new_value.strip(): 
                            obj_copy[field] = value
                            break
                        price = validate_and_format_price(new_value.strip())
                        if price:
                            obj_copy[field] = price
                            break
                else:
                    new_value = input(YELLOW + f"Edit {camel_to_words(field)} (Press Enter to keep current value): " + RESET)
                    
                    if new_value.strip():  # Check if the input is not empty
                        obj_copy[field] = new_value.strip()
                    else:
                        obj_copy[field] = value
    
    edit_properties(updated_product, updated_product)
    
    updated_product["url"] = updated_product["id"] + "/" + format_url_string(updated_product["productName"])

    # Display the updated product
    if add:
        print(GREEN + "\nNew Product:" + RESET)
    else:
        print(GREEN + "\nUpdated Product:" + RESET)

    print_product_details(updated_product)

    # Ask the user if they want to save changes
    while True:
        save_option = input(YELLOW + "\nDo you want to save changes? (yes/no): " + RESET).lower()
        if save_option == "yes":
            if add:
                products_data['products'].append(updated_product)
                print(GREEN + "Product added successfully.")
                break
            else:
                # Update the original product with the changes
                product.update(updated_product)
                print(GREEN + "Product updated successfully.")
                print("\nUpdated Product:" + RESET)
                print_product_details(product)
                break
        elif save_option == "no":
            print(RED + "Changes discarded." + RESET)
            break
        else:
            print(RED + "Invalid option." + GREEN + "Please enter 'yes' or 'no'." + RESET)


    # Display the updated product
    print(GREEN + "\nUpdated Product:" + RESET)
    print_product_details(updated_product)

def is_product_name_valid(product_name, products_data):
    if not product_name.strip():
        return False
    for product in products_data['products']:
        if product.get('productName') == product_name:
            print(RED + "Product Name: " + product_name + " already exists.\n" + RESET)
            return False
    return True

def add_product(products_data):
    edit_product(None, products_data, True)

def remove_product(products_data):
    print_product_list(products_data)
    products = products_data['products']
    if not products:
        return
    product_id = input(RED + "Enter the Product ID to remove: " + RESET)
    featured_products = products_data.get("featuredProducts", [])  # Get the featuredProducts list or an empty list if it doesn't exist
    for product in products:
        if product['id'] == product_id:
            product_name = product['productName']
            if product_id in featured_products:
                featured_products.remove(product_id)
                print(GREEN + f"Product '{product_name}' (ID: {product_id}) removed from featuredProducts." + RESET)
                
            products_data['products'].remove(product)
            print(GREEN + f"Product '{product_name}' (ID: {product_id}) removed successfully." + RESET)
            return
    
    print(RED + "Product not found." + RESET)

def edit_featured_products(products_data):
    while True:
        print(YELLOW + "\nFeatured Products:\n" + RESET)
        featured_products = products_data.get("featuredProducts", [])

        if not featured_products:
            print(ORANGE + "No featured products." + RESET)
        else:
            print(BLUE + "ID - Product Name" + RESET)
            for product_id in featured_products:
                product = find_product_by_id(products_data, product_id)
                if product:
                    print(f"{product_id} - {product.get('productName')}")

        print(YELLOW + "\nOptions:\n" + RESET)
        print("1. Add Featured Product")
        print("2. Remove Featured Product")
        print("3. Clear Featured Products")
        print("4. Go back to main menu")

        option = input(GREEN + "\nEnter your choice (1/2/3/4): " + RESET)

        if option == "1":
            print_product_list(products_data)
            product_id = input(GREEN + "Enter the ID of the product to add as a featured product: " + RESET)
            if product_id not in featured_products:
                featured_products.append(product_id)
                print(GREEN + "Product added as a featured product." + RESET)
            else:
                print(ORANGE + "Product is already a featured product." + RESET)
            
        elif option == "2":
            if not featured_products:
                print(ORANGE + "No featured products to remove." + RESET)
            else:
                print(BLUE + "ID - Product Name" + RESET)
                for product_id in featured_products:
                    product = find_product_by_id(products_data, product_id)
                    if product:
                        print(f"{product_id} - {product.get('productName')}")

                product_id = input(GREEN + "Enter the ID of the product to remove from featured products: " + RESET)
                if product_id in featured_products:
                    featured_products.remove(product_id)
                    print(RED + "Product removed from featured products." + RESET)
                else:
                    print(ORANGE + "Product is not a featured product." + RESET)
            
        elif option == "3":
            if not featured_products:
                print(ORANGE + "No featured products to clear." + RESET)
            else:
                confirmation = input(RED + "Are you sure you want to clear all featured products? (yes/no): " + RESET).lower()
                if confirmation == "yes":
                    featured_products.clear()
                    print(GREEN + "Featured products cleared." + RESET)
                else:
                    print(ORANGE + "Operation canceled." + RESET)

        elif option == "4":
            break

        else:
            print(RED + "Invalid option." + GREEN + " Please select 1, 2, 3, or 4." + RESET)

def camel_to_words(camel_case_string):
    # Use regular expression to split the camelCase string
    words = re.findall(r'[A-Z]?[a-z]+|[A-Z]+(?=[A-Z]|$)|\d+', camel_case_string)
    
    # Capitalize the first letter of each word and join them with spaces
    result = ' '.join(word.capitalize() for word in words)
    
    return result

def validate_and_format_price(price_str):
    # Regular expression pattern for valid prices
    price_pattern = r'^\d+(\.\d{1,2})?$'

    # Check if the input matches the price pattern
    if re.match(price_pattern, price_str):
        # If it's a valid price, format it to have exactly 2 decimal places
        if '.' in price_str:
            dollars, cents = price_str.split('.')
            cents = cents.ljust(2, '0')  # Ensure there are always 2 decimal places
            formatted_price = f"{dollars}.{cents}"
        else:
            formatted_price = f"{price_str}.00"  # Add .00 for prices without decimal places
        return formatted_price
    else:
        return None

def format_url_string(input_string):
    # Replace whitespace with hyphens, remove non-alphanumeric characters,
    # and convert to lowercase using regular expressions.
    formatted_string = re.sub(r'\s+', '-', input_string)  # Replace whitespace with hyphens
    formatted_string = re.sub(r'[^a-zA-Z0-9-]', '', formatted_string)  # Remove non-alphanumeric characters except hyphens
    formatted_string = formatted_string.lower()  # Convert to lowercase

    return formatted_string

def add_url_to_products(json_obj):
    if "products" in json_obj:
        products = json_obj["products"]
        for product in products:
            if "productName" in product:
                product["url"] = product["id"] + "/" + format_url_string(product["productName"])


def load_product_content_editor():
    print(YELLOW + "\nYou have selected Product Editor Utility.\n" + RESET)
    products_data = load_json(PRODUCTS_JSON_FILEPATH)
    if products_data is None:
        print("Error loading products data.")
        return

    while True:
        print(YELLOW + "\nOptions:\n" + RESET)
        print("1. View/Edit Products")
        print("2. Add Product")
        print("3. Remove Product")
        print("4. Update Featured Products")
        print("5. Save and Exit")
        print("6. Discard Changes and Exit")
        sub_choice = input(GREEN + "\nEnter your choice (1/2/3/4/5): " + RESET)

        if sub_choice == '1':
            add_url_to_products(products_data)
            view_products(products_data)
            # You can add editing code here
        elif sub_choice == '2':
            add_product(products_data)
        elif sub_choice == '3':
            remove_product(products_data)
        elif sub_choice == '4':
            edit_featured_products(products_data)
        elif sub_choice == '5':
            save_json(PRODUCTS_JSON_FILEPATH, products_data)
            break
        elif sub_choice == '6':
            break
        else:
            print(RED + "Invalid choice." + GREEN + "Please select 1, 2, 3, or 4." + RESET)

def main():
    while True:
        print(YELLOW + "\nWelcome to Rider Coffee Roaster Content Editor Utility!\n" + RESET)
        print(YELLOW + "Use this tool to edit page text writeups or product information content for the Rider Coffee Roaster Website.\n" + RESET)
        print(YELLOW + "\nOptions:\n" + RESET)
        print("1. Edit Products")
        print("2. Edit Writeups")
        print("3. Exit")
        choice = input(GREEN + "\nEnter your choice (1/2/3): " + RESET)

        if choice == '1':
            load_product_content_editor()
        elif choice == '2':
            print(RED + "Writeup edit utility is not ready yet." + RESET)
        elif choice == '3':
            print(YELLOW + "Exiting. Thank you for using Content Editor Utility!" + RESET)
            break
        else:
            print(RED + "Invalid choice." + GREEN +  "Please select 1 or 2." + RESET)

if __name__ == "__main__":
    main()

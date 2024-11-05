Product Feed Generator
This Node.js script connects to a MySQL database, retrieves products from specific categories, and generates an XML product feed.

What It Does
Connects to a MySQL database and fetches categories containing the keyword "xuping."
For each filtered category, it retrieves associated products.
Generates an XML file (feed.xml) containing the product details, including title, price, availability, description, and images.

How to Use
Install Dependencies: Run npm install to install the necessary packages.
Configure Database: Update the database connection settings in the script.
Run the Script: Execute the script with node your-script-file.js.
Check Output: The XML file feed.xml will be created in the project directory.

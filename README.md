Product Feed Generator for Joomla
This Node.js script connects to a MySQL database from a Joomla CMS, retrieves products from specific categories, and generates an XML product feed suitable for Google Merchant Ads.

What It Does
Connects to a Joomla database and fetches categories containing the keyword "xuping."
Retrieves associated products for each filtered category.
Generates an XML file (feed.xml) with product details, including title, price, availability, description, and images.
How to Use
Install Dependencies: Run npm install to install the necessary packages.
Configure Database: Update the database connection settings in the script to match your local Joomla database.
Run the Script: Execute the script with node your-script-file.js.
Check Output: The XML file feed.xml will be created in the project directory, ready for Google Merchant Ads.

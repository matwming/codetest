### How to run this app locally on your Machine:
1. Download the zip file or git clone + address;
2. Open the folder with VS code;
3. Install all dependencies by running npm i;
4. Run npm start to open a local development environment.
### How to use this app:
1. There are two pages 'Trades' and 'Withdraws', which can be found on the top of the page. 'Trades' is the default page. Click 'Withdraws' will navigate to 'Widthraws' page;
2. On each page, there is a 'Form' with a 'search' and 'reset' button. A result table is shown on the bottom of the page with a pagination. You can change pages and page sizes based on your preferences.
3. Users' result will not be lost even if you refresh the page
### Total Time Taken:
1. Reading and understanding all requirements: 20 mins;
2. Testing the two APIs with postman: 40 minutes;
3. Building the app:2 hours;
4. Testing the app:40 mins;
5. Polish and Beautify the app: 40 minutes;

**Total time taken:** 4 hours and 20 minutes
### Additional Info about what I used:
1. I used the newest react edition 16.8.6 with hook. No Class is used in this app.
2. As this is a very simple app, I did not use redux to manage global state.
3. I used react router for routing.
4. In CSS, I used bootstrap css and element-UI for react. Styled-component is slightly used in Header.js.
5. In network request, I used axios. All requests are cancelable to prevent memory leak when mount and unmount components but network requests are still ongoing.
6. Persistance result is achived by storing data in localStorage.

### Notes on 'withdraws' API:
There seems to be a problem with 'withdraws' api. 

When I test this api using postman with 'filter[createdAt][gte]=2019-02-13' and 'filter[createdAt][Ite]=2019-02-14' I should get 3 results. However, this api always returns 40 results regarless of the values in this filter 'filter[createdAt][gte]=2019-02-13' and 'filter[createdAt][Ite]=2019-02-14'. 

I also tried to change the format to  'filter[createdAt][gte]=2019-02-13' and **'filter[created][Ite]=2019-02-14'** . It still was not working.

Therefore the function to **'Search by range: Created at'** cannot be completed.

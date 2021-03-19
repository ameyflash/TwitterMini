Database -> TwitterMini
Contains 3 collections -> details, tweets, users
details collection contains user details
tweets collection contains all the tweets (by default 3 admin tweets are present)
users collection contains user credentials

On URL : "http://localhost:3000"
          Message is displayed to register or login
          
On URL : "http://localhost:3000/register"
Post method is used to collect username, email, password and confirmpassword fields
All fields are validated and not allowed to be empty
Username length should be minimum 4 and maximum 10
Password and ConfirmPassword length should be minimum 4
If the Password and ConfirmPassword field matches, then the password is hashed
User details are then stored in users collection and jwt token is generated.
But if the Username is repeated, then it shows that User name exists.

On URL : "http://localhost:3000/register"
Get method is used to show all the users
         
On URL : "http://localhost:3000/login"
Post method is used to check login credentials
          
On URL : "http://localhost:3000/details"          
Post method is used to add details -> Num, Age, DOB and Gender
Get method is used to display the details
          
On URL : "http://localhost:3000/create-tweet"
Post method is used to create a tweet with username
          
On URL : "http://localhost:3000/main-page/:page"
Get method is used to display all the tweets
Pagination is used such that 2 tweets are visible per page
So when "main-page/1" is used, the first 2 tweets are seen
When "main-page/2" is used, the next 2 tweets are seen, and so on.
          
On URL : "http://localhost:3000/main-page/:user_uname"
Get method is used to get all the tweets of username provided in the url.
          
On URL : "http://localhost:3000/main-page/:tweet_id"
Put and Delete methods are used to edit or delete a particular tweet using the tweet id.
          
          

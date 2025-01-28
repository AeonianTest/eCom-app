//The following snippet is based on Week 4 Ex. 4 Course Material COSC2410 semester 1, 2024.

/*
    Refactoring to new DB API
*/
import React, { useState, useEffect } from "react";
import ErrorMessage from "./ErrorMessage";
import PostDataService from "../services/PostService";
import { getUserID, getUser, getReviews, getUsername } from "../data/data";
import {FaStar} from 'react-icons/fa';
//TODO: make user review star system
//TODO: make user edit and delete functionality for reviews

function AddCartForm({ addItem, product }) {
        const [activeUserID, setActiveUserID] = useState(null);

        //console.log(activeUserID);
        const [displayReviews, setDisplayReviews] = useState(false);
        const [field, setField] = useState("");
        const [posts, setPosts] = useState([]);
        const [usernames, setUsernames] = useState({});
        const [reviewExists, setReviewExists] = useState(false);
        const [changedPost, triggerChangedPost] = useState(false);
        const [errorMessage, setErrorMessage] = useState();
        const [editState, setEditState] = useState(false);
        const [editField, setEditField] = useState();
        const [rating, setRating] = useState();
        const [hover, setHover] = useState();

      //const activeUserID = getUserID(getUser());
        const handleSubmit = (event) => { //handle adding an item to the cart
            event.preventDefault(); //prevent default submit 
            addItem(product.product_name); //add the item to the cart state array in ShoppingCart.js
        };

      
        //fetches usernames aasynchronously and updates usernames state
        /*
        function timeout(delay){
          return new Promise(res=>setTimeout(res,delay));
        }*/


        //gets usernames based on userID
        const fetchUserName = async (userID) => {
          try {
            const name = await getUsername(userID);
            setUsernames((prevUsernames) => ({ ...prevUsernames, [userID]: name }));
          } catch (error) {
            console.error("error fetching username", error);
          }
        };

        //fetches active user ID to use for post submission
        useEffect(() => {
          const fetchUserID = async () => {
            try {
              const userID = await getUserID(getUser());
              setActiveUserID(userID);
            } catch (error) {
              console.error("error fetching activeUserID:", error);
            }
          };
          fetchUserID();
        }, []);
      

        //fetches usernames for all users in the posts array if theyre not already in the usernames state
        useEffect(() => {
          triggerChangedPost(false);

          const getPosts = async () => {
            //setPosts([]);
            const posts = await getReviews(product.product_id);
            setPosts(posts);

            console.log(posts);

            const userIds = posts.map(post => post.userID);
            userIds.forEach(userID => {
              //determines which posts are owned/made by the user
              if(userID === activeUserID){
                setReviewExists(true);
              }
              else{
                setReviewExists(false);
              }

              if (!usernames[userID]) {
                fetchUserName(userID);
              }
            });
          };

          getPosts();
        }, [product.product_id, usernames, changedPost, reviewExists ]);
        
        //review submit functionality
        const handleReviewSubmit = async (event) => {
          event.preventDefault();
          try {
            const initialReviewState = {
              userID: activeUserID,
              product_id: product.product_id,
              text: field,
              rating: rating
            };
            //const userID = await activeUserID;

            console.log(reviewExists);
            //validation checks
            if(field.length>100){
              setErrorMessage("Review must be under 100 characters.");
            }

            if(field === ""){
              setErrorMessage("Review field cannot be empty");
            }
            if(rating == null){
              setErrorMessage("Please rate the product");
            }

            //sends data to api if all tests succeed
            if(field !== "" && rating != null && field.length<=100)
            {
              await PostDataService.create(initialReviewState);
              setField("");
              const updatedPosts = await getReviews(product.product_id);
              setPosts(updatedPosts);
              setReviewExists(true);
              setErrorMessage();
            }


            //very bad practice but its the only way I could make this work
          } catch (error) {
            console.error("error submitting review:", error);
          }
        };


        //delete post functionality
        const deletePost = async (userID, product_id)=>{
          try{
            console.log(userID);
            console.log(product_id);
            const postToDelete = {
              userID: userID,
              product_id: product_id
            };

            console.log("executed1");
            //sends info to api for processing
            await PostDataService.deletePost(postToDelete);
            //reset states to prevent errors
            setReviewExists(false)
            setEditState(false)
            triggerChangedPost(true);

            console.log("executed2");

            console.log(posts);


            //triggerChangedPost(true);
          }catch(e){
            console.log("posterror",e);
          }
        }

        //edit post logic
        const editPost = async (userID, product_id)=>{

          const postToEdit = {
            userID: userID,
            product_id, product_id,
            text: editField,
            rating: rating
          }

          //validates text input
          console.log("finalRating",rating)
          if(field.length>100){
            setErrorMessage("Review must be under 100 characters.");
          }

          if(editField === ""){
            setErrorMessage("Review field cannot be empty");
          }
          if(rating == null){
            setErrorMessage("Please rate the product");
          }
          if(editField !== "" && rating != null && field.length<=100)
          {
          setEditState(false);

          //sends data to api
          await PostDataService.editPost(postToEdit);
          //await timeout(5000);
          triggerChangedPost(true);
          }

        }
        //used to update edit related state hooks
        const changeEditState = (postText)=>{
          setEditField(postText);
          setEditState(true);
        }

        /*
        useEffect(()=>{
          console.log(changedPost);
        },[changedPost]);

        
        useEffect(()=>{
          console.log("posts",posts);
        },[posts]);

        useEffect(()=>{
          console.log("rating",rating);
        },[rating]);
        */
    return (
        <div className="produce-item">
            <form onSubmit={handleSubmit}>
                {/*<input value={item} onChange={(event) => setItem(event.target.value)}/>*/}
                <div className="produce-item-flex">
                    <div className="produce-item-info">
                        <div className="produce-item-info-left">
                            {product.special_bool === true ? 
                                <p>{product.product_name}: $
                                    <span className="line-through">{product.price} </span> 
                                    <span>  | $
                                        { /* Convoluted line of actions to round price to nearest 0.05 */
                                            (Math.round((product.price - (product.price * product.specials.discount).toFixed(2)) * 20) / 20).toFixed(2)
                                        }
                                    </span>
                                </p> :
                                <p>
                                    {product.product_name}: ${product.price}
                                </p> 
                            }
                            {product.special_bool && <p className="produce-special"> On Special today! {product.specials.discount * 100}% Off</p>}
                            <p>{product.info}</p>
                        </div>
                        <div className="produce-item-info-right">
                            {<img src={ require(`../images/products/browse${product.product_id}.jpg`)} alt={product.product_name} className="product-img-cart"/>}
                        </div>
                    </div>
                
                        <div className="produce-button-submit">
                            <button>Add Item to Cart</button>
                        </div>
                </div>
                        
            </form>
                        <div>
                            {displayReviews &&
                            <div>
                            
                            <div className="reviews-body">
                                
                                <button onClick={()=>{setDisplayReviews(false)}}>Close</button>

                                <div className="reviews-flex">
                                    <div className="reviews-top">
                                        {<img className="reviews-image" src={ require(`../images/products/browse${product.product_id}.jpg`)}></img>}
                                        {product.product_name}: ${product.price}
                                    </div>

                                    <div className="reviews-bottom">
                                        {!reviewExists &&                                     
                                        <form className="review-form"onSubmit={handleReviewSubmit}>
                                            <label><h3>Add Review</h3></label>
                                            <div className="reviews-textbox">
                                              <textarea className="review-textarea"type="text" onChange={(event)=>{setField(event.target.value)}}rows="3" cols="50" value={field}></textarea>
                                            </div>
                                            <div>
                                              {field.length<=100 ? <label>{field.length}/100</label> : <label style={{color:'red'}}>{field.length}/100</label>}
                                            </div>
                                            <div className="review-ratings-wrapper">
                                            <div className="review-ratings">

                                              {
                                              /*The following Star Rating styling and module is based on "How to Create a Star Rating Component in React" by ILTECHS on Youtube*/
                                              [1,2,3,4,5].map((star,index)=>{
                                                const currentRating = index + 1;
                                                return(
                                                  <label>
                                                    <input style={{display:'none'}}type='radio' name='rating' value={currentRating} onClick={()=>setRating(currentRating)} aria-label={`rating-${currentRating}`} data-testid={`rating-${currentRating}`}/>
                                                    <FaStar
                                                    className="star"
                                                    style={{
                                                      fontSize: '2em',
                                                      color: currentRating <= (hover || rating) ? 'gold' : 'grey',
                                                      cursor: 'pointer'
                                                    }}
                                                    onMouseEnter={() => setHover(currentRating)}
                                                    onMouseLeave={() => setHover(null)}
                                                  />
                                                  </label>
                                                )
                                              })}
                                            </div>
                                          </div>
                                            <button>Submit</button>
                                        </form>}

                                        {posts.map((post) => (
                                            <div className="review-item" key={post.text}>
                                            {post.userID === activeUserID && 
                                            <div className="review-button-rows">
                                              {!editState ? 
                                                <button onClick={async ()=>{changeEditState(post.text)}}>Edit</button>
                                                :
                                                <button onClick={async ()=>{setEditState(false)}}>Cancel Edits</button>

                                              }
                                              <button onClick={()=>{ deletePost(post.userID, post.product_id)}}>Delete</button>
                                            </div>
                                            
                                            }
                                            <p><b>{usernames[post.userID] || 'Loading...'}</b></p>
                                            {(editState && post.userID === activeUserID) ? 
                                            <div>
                                              <textarea className="review-textarea" rows="5" cols="55" value = {editField} onChange={(event)=>{setEditField(event.target.value)}}></textarea> 
                                              <div>
                                                {field.length<=100 ? <label>{editField.length}/100</label> : <label style={{color:'red'}}>{field.length}/100</label>}
                                              </div>
                                              <button onClick={()=>{editPost(post.userID, post.product_id)}}>Submit changes</button>
                                              <div className="review-ratings-wrapper">
                                                <div className="review-ratings">

                                                  {
                                                  /*The following Star Rating styling and module is based on "How to Create a Star Rating Component in React" by ILTECHS on Youtube*/
                                                  [1,2,3,4,5].map((star,index)=>{
                                                    const currentRating = index + 1;
                                                    return(
                                                      <label>
                                                        <input style={{display:'none'}}type='radio' name='rating' value={currentRating} onClick={()=>setRating(currentRating)} display='hidden'/>
                                                        <FaStar
                                                        className="star"
                                                        style={{
                                                          fontSize: '2em',
                                                          color: currentRating <= (hover || rating) ? 'gold' : 'grey',
                                                          cursor: 'pointer'
                                                        }}
                                                        onMouseEnter={() => setHover(currentRating)}
                                                        onMouseLeave={() => setHover(null)}
                                                      />
                                                      </label>
                                                    )
                                                  })}
                                                </div>
                                              </div>
                                            </div>
                                            :
                                            <div>
                                              <p className="review-content">{post.text}</p>
                                              <div>
                                                {[...Array(post.rating)].map((_, i) => (
                                                  <FaStar key={i}/>
                                                ))}
                                              </div>
                                            </div>

                                            }

                                              
                                            </div>
                                            
                                        ))}
                                    </div>
                                </div>
                      
                            </div>
                              <div>
                                <div className="blackout"/>
                              </div>
                          </div>
                            
                            }
                        </div>
            <div className="review-button">
                <button onClick={()=>{setDisplayReviews(true)}}>Reviews</button>
            </div>
            {errorMessage && <ErrorMessage message={errorMessage}/>}
        </div>
    );
};

export default AddCartForm;
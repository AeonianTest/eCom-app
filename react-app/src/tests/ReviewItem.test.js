import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AddCartForm from '../fragments/AddCartForm';
import PostDataService from '../services/PostService';
import { getUserID, getUser, getReviews, getUsername } from '../data/data';

jest.mock('../services/PostService');
jest.mock('../data/data');

//mock localstorage


//create a mock product for use with the review logic
const mockProduct = {
    product_id: 1,
    product_name: 'Test Product',
    price: 10.0,
    special_bool: false,
    info: 'This is a test product',
    specials: { discount: 0.1 }
  };
  
  //create mock user
  const mockUser = { id: 123, name: 'Test User' };
  
  describe('AddCartForm', () => {
    beforeEach(() => {
      getUser.mockReturnValue(mockUser);
      getUserID.mockResolvedValue(mockUser.id);
      getUsername.mockResolvedValue(mockUser.name);
      getReviews.mockResolvedValue([]);
      PostDataService.create.mockResolvedValue({});
    });
  
    
    /*
        This Unit test aims to simulate the user interaction flow when the user clicks on the review button, fills out the forms and submits the review.
        It fills out a review form with a text input and star rating, then submit the form. The test
        will check if the form is submitted correctly, and verify that the expected data is sent to the backend.
        Additionally, it also verifies that the submitted review and associated star rating are displayed
        onscreen post submission.

    */

    test('adds a review', async () => {
        render(<AddCartForm addItem={jest.fn()} product={mockProduct} />);
    
        //click on review button
        fireEvent.click(screen.getByText('Reviews'));
    
        //wait for the form to actually render
        await waitFor(() => screen.getByRole('button', { name: /Submit/i }));
    
        //wait for userID to be set
        await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    
        //type review into text box
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'This product is awesome I rate this 5 stars!' } });
    
        //select star rating
        const starInput = screen.getByTestId('rating-5'); // Select the 5th star by data-testid
        fireEvent.click(starInput); // Click on the 5th star for rating
    
        // submit review form
        fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
    
        // wait for review form to be submitted and then displayed
        await waitFor(() => {
          expect(PostDataService.create).toHaveBeenCalledWith({
            userID: mockUser.id, 
            product_id: mockProduct.product_id,
            text: 'This product is awesome I rate this 5 stars!',
            rating: 5
          });
          expect(screen.getByText('This product is awesome I rate this 5 stars!')).toBeInTheDocument();
          const starIcons = screen.getAllByText((content, element) => element.tagName.toLowerCase() === 'svg');
          expect(starIcons.length).toBe(5); // check for 5 stars
        });
      });
    });
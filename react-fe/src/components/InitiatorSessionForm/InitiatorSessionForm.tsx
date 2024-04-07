import {useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import "./InitiatorSessionForm.css";
import apiClient from '../../services/apiService/apiService';
import GlobalContext from '../../context/GlobalContext';
import { AxiosError } from 'axios';

function InitiatorSessionForm() {

  const {globals, setGlobals} = useContext(GlobalContext); 

  const [formData, setFormData] = useState({
    roomName: '',
    displayedName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{[key:string]: string}>({});


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const roomName = formData.roomName.trim();
    const displayedName = formData.displayedName.trim();
    const email = formData.email.trim();
    const password = formData.password.trim();

    let validationErrors: {[key:string]: string} = {};

    if (!roomName) {
      validationErrors.roomName = 'roomName is required';
    }

    if (!displayedName) {
      validationErrors.displayedName = 'displayedName is required';
    }

    //need both email and password 
    if (!email && password) {
      validationErrors.email = 'if submitting email or password need both';
    }
    if (email && !password) {
      validationErrors.password = 'if submitting email or password need both';
    }

    
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = 'Email is invalid';
    }
    

    // If there are validation errors, set them and stop form submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    
    try{

      let res: any; 

      if (formData.email && formData.password){
          res = await apiClient.apiSessionsCreateRegisteredSessionPost({
          displayedName: displayedName,
          roomName: roomName,
          email: email,
          password: password
        },
        {
          withCredentials: true,
        });
      }else{
          res = await apiClient.apiSessionsCreateGuestSessionPost({
          displayedName: displayedName,
          roomName: roomName,
        },
        {
          withCredentials: true,
        });
      }

      if (res.status == 200){

        //set state variables with response data
        //want actual roomName and not the room name that will
        //be stripped and displayed
        setGlobals({...globals, 
          roomName: res.data.roomName,
          displayedName: res.data.displayedName,
          isInitiator: res.data.isInitiator
        });
        
        //navigate to receipt scan page
        navigate('/ReceiptScan');
      }

    }catch(err){
      
      if (err instanceof AxiosError){
        if(err.response && err.response.status == 401){
          setErrors({email: 'invalid email/password', password: 'invalid email/password'});
          return;
        }
      }
      else{
        console.log('InitiatorSessionForm::', err);
      }

    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="formContainer">

        {/*required fields */}
        <div className='formSection'>
          <div>
            <label htmlFor="roomName">Room Name</label>
            <br/>
            <input
              type="text"
              id="roomName"
              name="roomName"
              value={formData.roomName}
              onChange={handleChange}
            />
            {errors.roomName && <span className="errorText">{errors.roomName}</span>}
          </div>

          <div>
            <label htmlFor="displayedName">Your Displayed Name</label>
            <br/>
            <input
              type="text"
              id="displayedName"
              name="displayedName"
              value={formData.displayedName}
              onChange={handleChange}
            />
            {errors.displayedName && <span className="errorText">{errors.displayedName}</span>}
          </div>
        </div>

        {/*optional fields to login */}
        <div className='formSection'>
          <div>
            <label htmlFor="email">Email</label>
            <br/>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="errorText">{errors.email}</span>}
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <br/>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span className="errorText">{errors.password}</span>}
          </div>
        </div>


        <button type="submit">Submit</button>
        </div>
    </form>
  );
}

export default InitiatorSessionForm;
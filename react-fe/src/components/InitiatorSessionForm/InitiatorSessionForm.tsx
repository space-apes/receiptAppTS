import {useState} from 'react';
import "./InitiatorSessionForm.css";


function InitiatorSessionForm() {
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let validationErrors: {[key:string]: string} = {};

    if (!formData.roomName.trim()) {
      validationErrors.roomName = 'roomName is required';
    }

    if (!formData.displayedName.trim()) {
      validationErrors.displayedName = 'displayedName is required';
    }

    //need both email and password 
    if ((!formData.email.trim() && formData.password.trim()) ||
      (formData.email.trim() && !formData.password.trim())
    ) {
      validationErrors.email = 'if submitting email or password need both';
      validationErrors.password = 'if submitting email or password need both';
    }



    
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email.trim())) {
      validationErrors.email = 'Email is invalid';
    }
    

    // If there are validation errors, set them and stop form submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Submit the form if there are no errors
    console.log('Form submitted:', formData);
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


        {/* Submit button */}
        <button type="submit">Submit</button>
        </div>
    </form>
  );
}

export default InitiatorSessionForm;
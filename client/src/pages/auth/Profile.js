import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import omitDeep from "omit-deep";
import { PROFILE } from "../../graphql/Query";
import { USER_UPDATE } from "../../graphql/Mutation";

const Profile = () => {
  const { data } = useQuery(PROFILE);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    _id: "",
    name: "",
    email: "",
    username: "",
    images: [],
  });

  

  useMemo(() => {
    if (data) {
      setValues({
        _id: data.profile._id,
        name: data.profile.name,
        email: data.profile.email,
        username: data.profile.username,
        images: data.profile.images,
        about: data.profile.about,
      });
    }
  }, [data]);

  const [userUpdate] = useMutation(USER_UPDATE, {
    update: ({ data }) => {
      console.log("USER UPDATE MUTATION IN PROFILE", data);
      toast.success("Profile updated");
    },
  });

  const { username, name, email, about, images } = values;

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(values);
    setLoading(true);
    userUpdate({ variables: { input: values } });
    setLoading(false);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImageChange = () => {
    //
  };

  const profileUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={handleChange}
          className="form-control"
          placholder="Username"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          className="form-control"
          placholder="Name"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          className="form-control"
          placholder="Username"
          disabled
        />
      </div>

      <div className="form-group">
        <label>Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="form-control"
          placholder="Image"
        />
      </div>

      <div className="form-group">
        <label>About</label>
        <textarea
          name="about"
          value={about}
          onChange={handleChange}
          className="form-control"
          placholder="Username"
          disabled={loading}
        />
      </div>

      <button
        className="btn btn-primary"
        type="submit"
        disabled={!email || loading}
      >
        Submit
      </button>
    </form>
  );

  return <div className="container p-5">{profileUpdateForm()}</div>;
};

export default Profile;

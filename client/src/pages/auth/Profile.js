import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import omitDeep from "omit-deep";
import { PROFILE } from "../../graphql/Query";
import { USER_UPDATE } from "../../graphql/Mutation";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import UserProfile from "../../components/forms/UserProfile";
import FileUpload from "../../components/FileUpload";


const Profile = () => {
  const { state } = useContext(AuthContext);
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

  return (
    <div className="container p-5">
            <div className="row">
                <div className="col-md-12 pb-3">
                    {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Profile</h4>}
                </div>

                <FileUpload setValues={setValues} setLoading={setLoading} values={values} loading={loading} />
            </div>
            <UserProfile {...values} handleChange={handleChange} handleSubmit={handleSubmit} loading={loading} />
        </div>
  );
};

export default Profile;

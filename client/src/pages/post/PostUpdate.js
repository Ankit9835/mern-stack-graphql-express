import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { SINGLE_POST } from '../../graphql/Query';
import { useParams } from 'react-router-dom';
import { POST_UPDATE } from '../../graphql/Mutation';
import FileUpload from '../../components/FileUpload';


const PostUpdate = () => {
    const [values,setValues] = useState({
        content: '',
        image:{
            url: '',
            public_id: ''
        }
    })

    const {postId} = useParams()

    const [postUpdate] = useMutation(POST_UPDATE)

    const [singlePostUser, { data: singlePost }] = useLazyQuery(SINGLE_POST);
    const [loading, setLoading] = useState(false);

    

    const {content, image} = values

    useMemo(() => {
        if (singlePost) {
            console.log('test',singlePost)
            setValues({
                ...values,
                _id: singlePost.singlePostUser._id,
                content: singlePost.singlePostUser.content,
                image: singlePost.singlePostUser.image,
            });
        }
    }, [singlePost]);

    useEffect(() => {
        console.log(postId);
        singlePostUser({ variables: { postId } });
        console.log('single post', singlePost)
    }, []);


    const handleChange = (e) => {
        console.log('qrty')
        setValues({...values, [e.target.name]: e.target.value})
    }

    const handleSubmit = (e) => {
        console.log('test value', values)
        e.preventDefault()
        setLoading(true)
        console.log('values',values)
        postUpdate({ variables: { input: values } });
        setLoading(false)
        toast.success('Post Updated')
    }

    

    
    const updateForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <textarea
                    value={content}
                    onChange={handleChange}
                    name="content"
                    rows="5"
                    className="md-textarea form-control"
                    placeholder="Write something cool"
                    maxLength="150"
                    
                ></textarea>
            </div>

            <button className="btn btn-primary" type="submit">
                Post
            </button>
        </form>
    );

    return (
        <div className="container p-5">
            {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Update</h4>}

            <FileUpload
                values={values}
                loading={loading}
                setValues={setValues}
                setLoading={setLoading}
                singleUpload={true}
            />

            {updateForm()}
        </div>
    );
};

export default PostUpdate;

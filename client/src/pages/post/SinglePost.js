import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { SINGLE_POST } from '../../graphql/Query';
import { useParams } from 'react-router-dom';
import { POST_UPDATE } from '../../graphql/Mutation';
import FileUpload from '../../components/FileUpload';


const SinglePost = () => {
    const [values,setValues] = useState({
        content: '',
        image:{
            url: '',
            public_id: ''
        }
    })

    const {postId} = useParams()

    

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

    
    return (
        <div className="container p-5">
            {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Update</h4>}
        </div>
    );
};

export default SinglePost;

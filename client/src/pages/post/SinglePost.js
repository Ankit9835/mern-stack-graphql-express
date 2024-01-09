import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { SINGLE_POST } from '../../graphql/Query';
import { Link, useParams } from 'react-router-dom';
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

    

    

    useMemo(() => {
        if (singlePost) {
            console.log('tests',singlePost)
            setValues({
                ...values,
                _id: singlePost.singlePostUser._id,
                content: singlePost.singlePostUser.content,
                image: singlePost.singlePostUser.image,
                postedBy: {
                    email: singlePost.singlePostUser.postedBy.email,
                    username: singlePost.singlePostUser.postedBy.username,
                    name: singlePost.singlePostUser.postedBy.name
                }
            });
        }
    }, [singlePost]);

    useEffect(() => {
        singlePostUser({ variables: { postId } });
    }, []);

    const {content, image, _id} = values

    console.log('ids',values.postedBy ? values.postedBy.username : '')

    
    return (
        <div className="card text-center" style={{ minHeight: '375px' }}>
        <div className="card-body">
            
            <h4 className="text-primary">@{values.postedBy ? values.postedBy.username : ''}</h4>
            <hr />
            <small>{content}</small>
            <br />
            <br />
           
        </div>
    </div>
    );
};

export default SinglePost;

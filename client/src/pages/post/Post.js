import React, { useState, useContext, useEffect, fragment } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/authContext';
import { useQuery, useMutation } from '@apollo/react-hooks';
import omitDeep from 'omit-deep';
import FileUpload from '../../components/FileUpload';
import { POST_CREATE, POST_DELETE } from '../../graphql/Mutation';
import { POST_BY_USER } from '../../graphql/Query';
import { useNavigate } from 'react-router-dom';


const initialState = {
    content: '',
    image: {
        url: 'https://via.placeholder.com/200x200.png?text=Post',
        public_id: '123'
    }
};

const Post = () => {
    const navigate = useNavigate()
    const [values, setValues] = useState(initialState);
    const [loading, setLoading] = useState(false);

    // destructure
    const { content, image } = values;

    const [postCreate] = useMutation(POST_CREATE, {
        update: (cache, {data: {postCreate}}) => {
            // read Query from cache
            const { postByUser } = cache.readQuery({
                query:  POST_BY_USER
            });
            // write Query to cache
            cache.writeQuery({
                query:  POST_BY_USER,
                data: {
                    postByUser: [postCreate, ...postByUser]
                }
            });
        },
        onError: (err) => console.log(err.graphqQLError[0].message)
    })

    const {data: posts} = useQuery(POST_BY_USER)
    console.log('posts',posts)



    const [postDelete] = useMutation(POST_DELETE, {
        update: ({ data }) => {
            console.log('POST DELETE MUTATION', data);
            toast.error('Post deleted');
        },
        onError: (err) => {
            console.log(err);
            toast.error('Post delete failed');
        }
    });

    const handleDelete = async (postId) => {
        let answer = window.confirm('Delete?');
        if (answer) {
            console.log('id',postId)
            setLoading(true);
            postDelete({
                variables: { postId },
                refetchQueries: [{ query: POST_BY_USER }]
            });
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        postCreate({variables: {input: values}})
        setValues(initialState)
        setLoading(false)
        toast.success('Post Created!')
    };

    const handleChange = (e) => {
        e.preventDefault();
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const createForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <textarea
                    value={content}
                    onChange={handleChange}
                    name="content"
                    rows="10"
                    className="md-textarea form-control"
                    placeholder="Write something cool"
                    maxLength="150"
                    disabled={loading}
                ></textarea>
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading || !content}>
                Post
            </button>
        </form>
    );

    return (
        <div className="container p-5">
            {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Create</h4>}
            <div className="row">
                <div className="com-md-3">
                    <FileUpload
                        values={values}
                        loading={loading}
                        setValues={setValues}
                        setLoading={setLoading}
                        singleUpload={true}
                    />
                </div>

                <div className="col-md-9">{createForm()}</div>
            </div>
            <hr />
        {posts && posts.postByUser.map(p => (
          <div className="col-md-4" key={p._id}>
            <div className="card">
                
              <div className="card-body">
                <div className="card-title">
                  <h4>@{p.postedBy.username}</h4>
                </div>
                <p className="card-text">{p.content}</p>
               
                    <button onClick={() => handleDelete(p._id)} className="btn m-2 btn-danger">
                        Delete
                    </button>
                 <button onClick={() => navigate(`/post/update/${p._id}`)} className="btn m-2 btn-warning">Update</button>
              </div>
            </div>
          </div>
        ))}
        </div>
    );
};

export default Post;

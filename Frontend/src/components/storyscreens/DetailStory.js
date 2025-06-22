import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import "../../Css/DetailStory.css";
import Loader from '../GeneralScreens/Loader';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiEdit } from 'react-icons/fi';
import { BsBookmarkPlus, BsThreeDots, BsBookmarkFill } from 'react-icons/bs';

const DetailStory = () => {
  const [activeUser, setActiveUser] = useState({});
  const [story, setStory] = useState({});
  const [storyReadListStatus, setStoryReadListStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const slug = useParams().slug;
  const navigate = useNavigate();

  useEffect(() => {
    const getDetailStory = async () => {
      setLoading(true);
      let activeUser = {};

      try {
        const { data } = await axios.get("/auth/private", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        activeUser = data.user;
        setActiveUser(activeUser);
      } catch (error) {
        setActiveUser({});
      }

      try {
        const { data } = await axios.post(`/story/${slug}`, { activeUser });
        setStory(data.data);
        setLoading(false);

        const story_id = data.data._id;
        if (activeUser.readList) {
          setStoryReadListStatus(activeUser.readList.includes(story_id));
        }
      } catch (error) {
        setStory({});
        navigate("/not-found");
      }
    };

    getDetailStory();
  }, [slug]);

  const handleDelete = async () => {
    if (window.confirm("Do you want to delete this post")) {
      try {
        await axios.delete(`/story/${slug}/delete`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const editDate = (createdAt) => {
    const d = new Date(createdAt);
    return d.toLocaleString('eng', { month: 'long' }).substring(0, 3) + " " + d.getDate();
  };

  const addStoryToReadList = async () => {
    try {
      const { data } = await axios.post(`/user/${slug}/addStoryToReadList`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      setStoryReadListStatus(data.status);
      document.getElementById("readListLength").textContent = data.user.readListLength;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loading ? <Loader /> :
        <div className='Inclusive-detailStory-page'>

          <div className="top_detail_wrapper">
            <h5>{story.title}</h5>

            <div className='story-general-info'>
              <ul>
                {story.author &&
                  <li className='story-author-info'>
                    <img src={`/userPhotos/${story.author.photo}`} alt={story.author.username} />
                    <span className='story-author-username'>{story.author.username}</span>
                  </li>
                }
                <li className='story-createdAt'>{editDate(story.createdAt)}</li>
                <b>-</b>
                <li className='story-readtime'>{story.readtime} min read</li>
              </ul>

              {activeUser && story.author &&
                story.author._id === activeUser._id &&
                <div className="top_story_transactions">
                  <Link className='editStoryLink' to={`/story/${story.slug}/edit`}>
                    <FiEdit />
                  </Link>
                  <span className='deleteStoryLink' onClick={handleDelete}>
                    <RiDeleteBin6Line />
                  </span>
                </div>
              }
            </div>
          </div>

          <div className='story-content'>
            <div className="story-banner-img">
              <img src={`/storyImages/${story.image}`} alt={story.title} />
            </div>

            <div className='content' dangerouslySetInnerHTML={{ __html: (story.content) }} />
          </div>

          {activeUser.username &&
            <div className='fixed-story-options'>
              <ul>
                <li>
                  <i onClick={addStoryToReadList}>
                    {storyReadListStatus ? <BsBookmarkFill color='#0205b1' /> : <BsBookmarkPlus />}
                  </i>
                </li>

                <li className='BsThreeDots_opt'>
                  <i><BsThreeDots /></i>

                  {activeUser && story.author._id === activeUser._id &&
                    <div className="delete_or_edit_story">
                      <Link className='editStoryLink' to={`/story/${story.slug}/edit`}>
                        <p>Edit Story</p>
                      </Link>
                      <div className='deleteStoryLink' onClick={handleDelete}>
                        <p>Delete Story</p>
                      </div>
                    </div>
                  }
                </li>
              </ul>
            </div>
          }

        </div>
      }
    </>
  );
};

export default DetailStory;

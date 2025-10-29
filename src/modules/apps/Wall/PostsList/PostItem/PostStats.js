import React from 'react';
import Box from '@mui/material/Box';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import PropTypes from 'prop-types';
import { Fonts } from '@crema/constants/AppEnums';
import { useInfoViewActionsContext } from '@crema/context/AppContextProvider/InfoViewContextProvider';
import { putDataApi } from '@crema/hooks/APIHooks';

const PostStats = ({ post, setPostList }) => {
  const infoViewActionsContext = useInfoViewActionsContext();

  const toggleLikeStatus = () => {
    putDataApi('/wall/posts', infoViewActionsContext, {
      postId: post.id,
      status: !post.liked,
    })
      .then((data) => {
        setPostList(data);
        infoViewActionsContext.showMessage('Post Updated Successfully!');
      })
      .catch((error) => {
        infoViewActionsContext.fetchError(error.message);
      });
  };

  return (
    <Box
      sx={{
        mb: { xs: 4, xl: 6 },
        fontWeight: Fonts.MEDIUM,
        color: 'text.secondary',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}
    >
      <Box
        className='pointer'
        onClick={toggleLikeStatus}
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: post.liked ? 'primary.main' : 'text.secondary',
        }}
      >
        <ThumbUpAltOutlinedIcon
          sx={{
            fontSize: 18,
          }}
        />
        <Box
          component='span'
          sx={{
            fontSize: { xs: 12, md: 14 },
            ml: 1.5,
          }}
        >
          {post.likes} likes
        </Box>
      </Box>
      {post.comments.length > 0 && (
        <Box
          className='pointer'
          sx={{
            display: 'flex',
            alignItems: 'center',
            ml: 3,
          }}
        >
          <CommentOutlinedIcon
            sx={{
              fontSize: 18,
            }}
          />
          <Box
            component='span'
            sx={{
              fontSize: { xs: 12, md: 14 },
              ml: 1.5,
            }}
          >
            {post.comments.length} Comments
          </Box>
        </Box>
      )}
      <Box
        className='pointer'
        sx={{
          display: 'flex',
          alignItems: 'center',
          ml: 3,
        }}
      >
        <ShareOutlinedIcon
          sx={{
            fontSize: 18,
          }}
        />
        <Box
          component='span'
          sx={{
            fontSize: { xs: 12, md: 14 },
            ml: 1.5,
          }}
        >
          {post.shares} Shares
        </Box>
      </Box>
    </Box>
  );
};

export default PostStats;

PostStats.propTypes = {
  post: PropTypes.object,
  setPostList: PropTypes.func,
};

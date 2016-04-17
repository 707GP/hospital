package com.hrs.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.hrs.service.IUserService;

import com.hrs.dao.UserMapper;
import com.hrs.domain.User;

@Service("userService")
public class UserServiceImpl implements IUserService {
	@Resource
	private UserMapper userDao;

	@Override
	public User getUserById(int userId) {
		return this.userDao.selectByPrimaryKey(userId);
	}
	
}

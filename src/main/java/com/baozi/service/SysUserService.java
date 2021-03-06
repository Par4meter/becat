package com.baozi.service;

import com.baozi.po.SysUser;

import java.util.Date;

/**
 * @author wenjun.zhang
 * @create 2018-03-07 15:05
 * @description 用户相关的service
 **/
public interface SysUserService {

    /**
     * 查找平台用户数量
     * @return
     */
    public int findAllUserCount();

    /**
     * 根据用户ID查询用户最后登录时间
     * @param userId
     * @return
     */
    public Date findUserLastLoginTime(int userId);

    /**
     * 根据主键查询用户
     * @param userId
     * @return
     */
    public SysUser findSysUserByUserId(int userId);

    /**
     * 修改个人资料
     * @param sysUser
     */
    public int updateUserInfo(SysUser sysUser);

    /**
     * 修改个人密码
     * @param userId
     * @param newpwd
     * @return
     */
    public int updateUserPwd(int userId,String newpwd);
}

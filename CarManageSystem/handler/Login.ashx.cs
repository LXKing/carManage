﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using CarManageSystem.helper;
using System.Diagnostics;
using CarManageSystem.Extension;

namespace CarManageSystem.handler
{
    /// <summary>
    /// login 的摘要说明
    /// </summary>
    public class Login : IHttpHandler,IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string account = context.Request["userName"].Trim();
            string password = context.Request["userPsw"].Trim();
            dynamic json = new Newtonsoft.Json.Linq.JObject();

            //空检查
            if (CheckHelper.HasNull(account, password))
            {
                json.state = "有空值，请检查！";
                context.Response.Write(json.ToString());
                return;
            }

            using (cmsdbEntities cms = new cmsdbEntities())
            {
                json.state = "success";
                //用户名不正确
                var usrtemp = cms.user.FirstOrDefault(s => s.Account == account&&s.UserType != -1);
                if (usrtemp == null)
                {
                    json.data = "2";
                    context.Response.Write(json.ToString());
                    return;
                }
                //密码不正确
                var tempPwd = System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(password, "MD5");
                var usr = cms.user.FirstOrDefault(s => s.Account == account && s.Password == tempPwd);
                if (usr == null)
                {
                    json.data = "3";
                    context.Response.Write(json.ToString());
                    return;
                }
                var str = CheckHelper.LoginRole(context, usrtemp);
                if(str==null)
                {
                    return;
                }
                json.token = str;

                

                var loginDates = usr.LastLoginDate;
                var sdate = DateTime.Now.ToString("yyyy/MM/dd HH:mm");
                if (string.IsNullOrEmpty(loginDates))
                {
                    usr.LastLoginDate = sdate+"|"+sdate;
                }
                else
                {
                    var loginDateArry = loginDates.Split('|');
                    usr.LastLoginDate = loginDateArry[1] + "|" + sdate;
                }

                if (usr.UserType == 0)
                {
                    json.data = "0";
                    context.Response.Write(json.ToString());
                }
                else
                {
                    json.data = "1";
                    context.Response.Write(json.ToString());
                }
                cms.SaveChanges();
                cms.Dispose();
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}
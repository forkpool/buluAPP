var activeUrl = "http://192.168.0.215:8080/";
var codes = -1;
var ids;

function getValue() {
	var str = decodeURIComponent(window.location.search),
		obj = {},
		item = [];
	if(str && ~str.indexOf('?')) {
		str = str.slice(1)
	}
	if(str != null && str != "") {
		if(str.indexOf("&") != -1) {
			item = str.split("&");
			for(var i = 0; i < item.length; i++) {
				var itemValue = item[i].split("=");
				obj[itemValue[0]] = itemValue[1];
			}
		} else {
			item = str.split("=");
			obj[item[0]] = item[1];
		}
		return obj;
	}
}
$(function() {

	//			获取验证码
	function yzm() {
		time = 60;
		// 重置
		if(this.timers) {
			clearInterval(this.timers);
		};
		// 计时器
		this.timers = setInterval(function() {
			--this.time;
			if(this.time <= 0) {
				this.time = 0;
				$('.huoqu').removeAttr("disabled")
				$('.huoqu').text('获取验证码')
				clearInterval(this.timers);
				return false;
			}
			$('.huoqu').text(this.time + 's后重发');

		}, 1000)
		$('.huoqu').attr("disabled", true)
		var oldPhone = $('.tellphone').val();
		$.ajax({
			type: "get",
			url: activeUrl + "/user/SendVerificationCode",
			data: {
				oldPhone: oldPhone
			},
			async: false,
			dataType: "json",
			success: function(data) {

				codes = data.data
				console.log(codes)
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				alert("请求失败！");
			}
		});
	}

	//			点击注册

	function submits() {
		var $name = $('.stud-name').val();
		var $accountNumber = $('.zhanghao').val();
		var $password = $('.passwords').val();
		var $zcPassword = $('.zc-passwords').val();
		var $patriarch = $('.parent-name').val();
		var $tel = $('.tellphone').val();
		//              var $patriarch=$('.auth-code').val();
		var $submit = $('.submit')
		var $code = $('.auth-code').val()
		$.ajax({
			type: 'post',
			url: activeUrl + '/user/registUser',
			//                  http:"//localhost:8080/user/registUser?userName=房金&accountNumber=qwe12ssss3456&passwd=123456&patriarch=景浩&tel=18510003196"
			data: {
				userName: $name,
				accountNumber: $accountNumber,
				passwd: $password,
				patriarch: $patriarch,
				tel: $tel
			},
			dataType: 'json',
			beforeSend: function() {
				//                        判断用户名是否为空
				if(!$name) {
					ycTips('您的姓名不能为空哦', "确定")
					return false;
				}
				//                        判断账户是否为空
				if(!$accountNumber) {
					ycTips('您的账号不为空哦', "确定")
					return false;
				}
				if(!/^([a-zA-Z]*\d+[a-zA-Z]+)|(\d*[a-zA-Z]+\d+)$/.test($accountNumber)) {
					ycTips('账号必须包含英文和数字哦', '确定')
					return false;
				}
				if(!$password) {
					ycTips('密码不能为空', "确定");
					return false;
				}
				//判断密码输入的长度是否为6~11之间
				if($password.length < 6 || $password.length > 11) {
					ycTips('请输入6-13位的密码', "确定")
					return false;
				}

				//                        判断密码和确认密码是否一致
				if($password != $zcPassword) {
					ycTips('两次密码不一致', "确定")
					return false;
				}
				if(!$patriarch) {
					ycTips('请输入家长姓名', "确定")
					return false;
				}
				if(!$tel) {
					ycTips('手机号不能为空', "确定")
					return false;
				}

				if(!/^1[3,5,7,8]\d{9}$/.test($tel)) {
					ycTips('请输入正确的手机号', '确定')
					return false;
				}

				if(!$code) {
					ycTips('验证码不能为空', '确定')
					return false;
				}

				if($code != codes) {
					ycTips('验证码输入不正确', '确定')
					return false;
				}

			},
			success: function(data) {
				console.log(data)
				var ids = data.data
				console.log(ids)
				var msg = data.msg
				ycTips(msg, '确定')

				if(data.code == 10000) {
				registerSuccessToHomePage();//这是我的注册成功的跳转
//					window.location.href = "information.html?userName=" + $name + "&accountNumber=" + $accountNumber + "&passwd=" + $password + "&patriarch" + $patriarch + "&tel" + $tel + '&id=' + ids;
				}

			},

		})
	}

	// 			学号绑定
	function binding() {
		var xhName = $('.xh-name').val();
		var xhTell = $('.xh-tell').val();
		var xuehao = $('.xuehao').val();

		//                        判断用户名是否为空
		if(!xhName) {
			ycTips('学员姓名不能为空', "确定")
			return false;
		}

		if(!xhTell) {
			ycTips('手机号不能为空', "确定")
			return false;
		}

		if(!/^1[3,5,7,8]\d{9}$/.test(xhTell)) {
			ycTips('请输入正确的手机号', '确定')
			return false;
		}

		if(!xuehao) {
			ycTips('您输入的学号不能为空', '确定')
			return false;
		}

	}

	var lists = $('#reg').children()
	console.log(lists)
	//遍历所有状态消息
	for(var i = 0; i < lists.length; i++) {
		//全部事件代理
		lists[i].onclick = function(e) {
			var e = e || window.event;
			var el = e.srcElement;
			if(!el) {
				el = e.target; //兼容火狐
			}

			switch(el.className) {

				case "huoqu":
					yzm()
					break;
				case "logins":
					submits()
					break;
				case 'binding':
					binding()
			}
		}
	}

	//			修改信息 出生日期和性别
	//          var id = getValue()['id'] || ''; 
	//          console.log(id)
	$('.finish').click(function() {
		var sex = $('#selected').find('option:selected').val()
		var years = $('.birthday').find('option:selected').val()
		var month = $('.birthday1').find('option:selected').val()
		var month = month < 10 ? '0' + month : month;
		var day = $('.birthday2').find('option:selected').val()
		var day = day < 10 ? '0' + day : day;
		var birthDate = (years + '/' + month + '/' + day)
		//				console.log(birthday)
		//				console.log(sex)
		$.ajax({
			type: 'post',
			url: activeUrl + 'user/completion',
			//                  http:"//localhost:8080/user/registUser?userName=房金&accountNumber=qwe12ssss3456&passwd=123456&patriarch=景浩&tel=18510003196"
			data: {
				sex: sex,
				birthDate: birthDate,
				id: id
			},
			dataType: 'json',

			success: function(data) {
				console.log(data)
				if(data.code == 10000) {
					window.location.href = "login.html?sex=" + sex + "&birthDate=" + birthDate + '&id=' + id;
				}

			}

		})
	})

	//          登录
	//			user/LoginUser?accountNumber=jh123456&password=123456
	$('.logins').click(function() {
//	alert(1)
		var accountNumbers = $('.tells').val()
		var passwd = $('.password').val()
		var tel = $('.tells').val()
		var s = accountNumbers
		//				var re = new RegExp("^[a-zA-Z0-9]+$"); 
		var reg = /^[0-9]+.?[0-9]*$/;
		if(reg.test(s)) {
//			alert('手机号登录')
			//
			$.ajax({
				type: 'post',
				url: activeUrl + 'user/LoginUser',
				//                  http:"//localhost:8080/user/registUser?userName=房金&accountNumber=qwe12ssss3456&passwd=123456&patriarch=景浩&tel=18510003196"
				data: {
					tel: accountNumbers, //账号登录
					passwd: passwd
				},

				dataType: 'json',

				success: function(data) {
					var msg = data.msg

//					alert(999999999)
					console.log(data.msg)
					if(data.code == 10000) {
					    onClickLogin();//这个是我的登录方法
//					window.location.href ='../home/home.html';
					}else {
					    alert("请输入正确的手机号");
					}

				}

			})
		} else {
//			alert('账号')
			$.ajax({
				type: 'post',
				url: activeUrl + 'user/LoginUser',
				//                  http:"//localhost:8080/user/registUser?userName=房金&accountNumber=qwe12ssss3456&passwd=123456&patriarch=景浩&tel=18510003196"
				data: {
					accountNumber: accountNumbers, //账号登录
					passwd: passwd
				},
				dataType: 'json',

				success: function(data) {
					//                  	var accountNumbers=$('.tells').val()

					//                  	console.log(data)
					console.log(data.msg)
					if(data.code == 10000) {
						alert('登录成功')
					}

				}

			})
		}

	})

	// 		})

})
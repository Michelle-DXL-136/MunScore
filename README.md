# MUN 分数管理系统

## 设置

### 安装环境

1. 安装 Conda（跟随[官方教程](https://conda.io/projects/conda/en/latest/user-guide/install/macos.html)安装即可）。
2. 打开命令行并运行
   ```
   conda create -n mun-score python=3.8
   conda activate mun-score
   conda install flask flask-sqlalchemy flask-socketio flask-restful flask-apscheduler flask-login flask-caching flask-cors
   ```

## 运行

1. 更改工作路径至当前文件夹。
   ```cd MunScore```
2. 切换至 Conda 环境。
   ```conda activate mun-score```
3. 运行
   ```python run.py```
4. 访问 URL 即可（开发环境下默认为 `http://localhost:5000/`）。

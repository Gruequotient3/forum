import os
import sys
import json


def get_cookie(key : str):
    if "HTTP_COOKIE" in os.environ:
        cookies = os.environ.get("HTTP_COOKIE")
        if (cookies == ""):
            return None
        cookies = cookies.split("; ")
        for cookie in cookies:
            (name, value) = cookie.split("=")
            if (key.lower() == name.lower()):
                return value
    return None


def get_arg(key : str):
    if "QUERY_STRING" in os.environ:
        args = os.environ.get("QUERY_STRING")
        args = args.split("&")
        for arg in args:
            (name, value) = arg.split("=")
            if (key.lower() == name.lower()):
                return value
    return None

def load_post_args():
    contents = ""
    length = 0
    if not "CONTENT_LENGTH" in os.environ:
        return None
    length = int(os.environ.get("CONTENT_LENGTH"))
    contents += sys.stdin.read(length)
    contents = contents.split("&")

    args: dict = {}
    for content in contents:    
        (name, value) = content.split("=")
        args.setdefault(name, value)

    return args

def load_post_args_json():
    content = ""
    length = 0
    if not "CONTENT_LENGTH" in os.environ:
        return None
    length = int(os.environ.get("CONTENT_LENGTH"))
    content += sys.stdin.read(length)
    content_json = json.loads(content)
    return content_json
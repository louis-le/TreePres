import json
from os import walk, path


def file_to_dict(fpath):
    return {
        'title': path.basename(fpath),
        'type': 'file',
        'key': fpath,
    }


def folder_to_dict(rootpath):
    return {
        'title': path.basename(rootpath),
        'folder': 'true',
        'key': rootpath,
        'children': [],
    }


def tree_to_dict(rootpath):
    root_dict = folder_to_dict(rootpath)
    root, folders, files = walk(rootpath).next()
    root_dict['children'] = [file_to_dict(path.sep.join([root, fpath])) for fpath in files]
    root_dict['children'] += [tree_to_dict(path.sep.join([root, folder])) for folder in folders]
    return root_dict


def tree_to_json(rootdir, pretty_print=True):
    root, folders, files = walk(rootdir).next()
    root_dict = [tree_to_dict(path.sep.join([root, folder])) for folder in folders]
    root_dict += [file_to_dict(path.sep.join([root, fpath])) for fpath in files]
    if pretty_print:
        js = json.dumps(root_dict)
    else:
        js = json.dumps(root_dict)
    return js


def return_rest():
    return tree_to_json('./')

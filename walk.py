import json
from os import walk, path


def file_to_dict(fpath):
    return {
        'name': path.basename(fpath),
        'type': 'file',
        'path': fpath,
        'tag': 'org',
    }


def folder_to_dict(rootpath):
    return {
        'name': path.basename(rootpath),
        'type': 'folder',
        'path': rootpath,
        'tag': 'org',
        'children': [],
    }


def tree_to_dict(rootpath):
    root_dict = folder_to_dict(rootpath)
    root, folders, files = next(walk(rootpath))
    root_dict['children'] = [file_to_dict(path.sep.join([root, fpath])) for fpath in files]
    root_dict['children'] += [tree_to_dict(path.sep.join([root, folder])) for folder in folders]
    return root_dict


def tree_to_json(rootdir, pretty_print=True):
    root, folders, files = next(walk(rootdir))
    root_dict = [tree_to_dict(path.sep.join([root, folder])) for folder in folders]
    root_dict += [file_to_dict(path.sep.join([root, fpath])) for fpath in files]
    if pretty_print:
        js = json.dumps(root_dict, indent=4, encoding='utf-8')
    else:
        js = json.dumps(root_dict, encoding='utf-8')
    return js


def return_rest():
    return tree_to_json('c:\\Users\\louisle\\Documents')

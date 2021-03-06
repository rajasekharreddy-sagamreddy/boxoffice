# -*- coding: utf-8 -*-

from flask import make_response, render_template, jsonify, request
from coaster.views import load_models
from boxoffice import app
from boxoffice.models import ItemCollection
from utils import xhr_only, cors


def jsonify_item(item):
    price = item.current_price()
    if price:
        return {
            'name': item.name,
            'title': item.title,
            'id': item.id,
            'description': item.description.text,
            'quantity_available': item.quantity_available,
            'quantity_total': item.quantity_total,
            'category_id': item.category_id,
            'item_collection_id': item.item_collection_id,
            'price': price.amount,
            'price_category': price.title,
            'price_valid_upto': price.end_at,
            'discount_policies': [{'id': policy.id, 'title': policy.title, 'is_automatic': policy.is_automatic}
                                  for policy in item.discount_policies]
        }


def jsonify_category(category):
    category_items = []
    for item in category.items:
        item_json = jsonify_item(item)
        if item_json:
            category_items.append(item_json)
    if category_items:
        return {
            'id': category.id,
            'title': category.title,
            'name': category.name,
            'item_collection_id': category.item_collection_id,
            'items': category_items
        }


@app.route('/api/1/boxoffice.js')
@cors
def boxofficejs():
    return make_response(jsonify({
        'script': render_template('boxoffice.js', base_url=request.url_root.strip('/'),
        razorpay_key_id=app.config['RAZORPAY_KEY_ID'])
    }))


@app.route('/ic/<item_collection>', methods=['GET', 'OPTIONS'])
@load_models(
    (ItemCollection, {'id': 'item_collection'}, 'item_collection')
    )
@xhr_only
@cors
def item_collection(item_collection):
    categories_json = []
    item_collection.categories.sort(key=lambda category: category.seq)
    for category in item_collection.categories:
        category_json = jsonify_category(category)
        if category_json:
            categories_json.append(category_json)
    return jsonify(html=render_template('boxoffice.html'), categories=categories_json)

"""add used to discount_coupon

Revision ID: 4f3fe36e0880
Revises: 45de268cd444
Create Date: 2016-04-04 13:37:26.556776

"""

# revision identifiers, used by Alembic.
revision = '4f3fe36e0880'
down_revision = '45de268cd444'

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


def upgrade():
    op.add_column('discount_coupon', sa.Column('used', sa.Boolean(), nullable=True))


def downgrade():
    op.drop_column('discount_coupon', 'used')

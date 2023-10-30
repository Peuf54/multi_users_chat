class AddLastReadAtToChannelUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :channel_users, :last_read_at, :datetime
  end
end

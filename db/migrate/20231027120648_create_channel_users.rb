class CreateChannelUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :channels do |t|
      t.string :name

      t.timestamps
    end
    
    create_table :channel_users do |t|
      t.belongs_to :channel, null: false, foreign_key: true
      t.belongs_to :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end

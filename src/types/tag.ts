export interface Tag {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
}

export interface CustomerTag {
  customer_id: string
  tag_id: string
  created_at: string
}

export interface TagWithCount extends Tag {
  customer_count: number
}

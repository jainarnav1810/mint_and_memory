export interface Bid {
  id: string;
  listing_id: string;
  bidder_id: string;
  amount: number;
  created_at: string;
  bidder_name?: string;
}

export interface BidSubmission {
  listing_id: string;
  amount: number;
}

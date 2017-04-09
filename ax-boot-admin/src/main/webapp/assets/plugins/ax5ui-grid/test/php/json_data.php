<?php
/**
 * 그리드용 Json Data 생성기
 */

require_once 'db/db.config.php';

// 가상 데이터 생성용 클래스
// $faker = Faker\Factory::create('ko_KR');

$ret = false;
$mode = isset($_POST['mode']) ? $_POST['mode'] : 'read';

$sales = new json_data();

// Json 헤더 설정
header('Content-Type: application/json');

switch($mode) {
    case 'update':
        if(isset($_POST['id']) && $_POST['id']) {
            $ret = $sales
                ->set($_POST)
                ->update($_POST['id'])
                ->get_json();
        }
        break;

    case 'delete':
        if(isset($_POST['ids']) && !empty($_POST['ids'])) {
            $ret = $sales
                ->delete($_POST['ids'])
                ->get_json();
        }
        break;

    default:
        $len = isset($_POST['len']) ? $_POST['len'] : 10;
        $page = isset($_POST['page']) ? $_POST['page'] : 1;
        $sortInfo = isset($_POST['sort']) ? $_POST['sort'] : '';

        $ret = $sales
            ->set_limit($len)
            ->set_page($page)
            ->set_sort($sortInfo)
            ->read()
            ->get_json();
        break;

}

echo $ret;

class json_data {
    protected $db;
    protected $ret;
    protected $setData;
    protected $data;
    protected $page;
    protected $offset;
    protected $limit;
    protected $tbl;
    protected $sort;

    public function __construct($page = 1, $limit = 10)
    {
        $this->db = Query(array(
            'type' => 'sqlite',
            'host' => '',
            'user' => '',
            'pass' => '',
            'port' => '',
            'database' => '',

            // Only required
            // SQLite or Firebird
            'file' => 'db/sample.db',

            // Optional paramaters
            'prefix' => '',     // Database table prefix
            'alias' => 'default'        // Connection name for the Query function
        ));

        $this->ret = array(
            'status' => 'success',
            'msg' => '',
            'data' => ''
        );

        $this->tbl = 'sales';
        $this->data = false;
        $this->setData = array();

        return $this;
    }

    public function read()
    {
        $this->page = intval($this->page) > 0 ? intval($this->page) : 1;

        $this->limit = intval($this->limit);
        $this->offset = ($this->page - 1) * $this->limit;

        $total_cnt = $this->db->count_all_results($this->tbl);
        
        if(is_array($this->sort) && !empty($this->sort)) {
            foreach($this->sort as $item) {
                $this->db->order_by($item['key'], $item['orderBy']);
            }
        }

        $this->data['list'] = $this->db
            ->limit($this->limit, $this->offset)
            ->get($this->tbl)
            ->fetchAll(PDO::FETCH_ASSOC);

        $this->data['page'] = array(
            'currentPage' => $this->page - 1,
            'pageSize' => $this->limit,
            'totalPages' => ceil($total_cnt / $this->limit),
            'totalElements' => $total_cnt
        );

        return $this;
    }

    public function update($id)
    {
        $column = array('company', 'price', 'amount');

        foreach($column as $key) {
            if(isset($this->setData[$key])) {
                $this->db->set($key, $this->setData[$key]);
            }
        }

        $cost = $this->setData['price'] * $this->setData['amount'];
        $this->db->set('cost', $cost);

        $this->db
            ->where('id', $id)
            ->update($this->tbl);

        $this->data['cost'] = $cost;
        
        return $this;
    }

    public function delete($ids)
    {
        $this->data = $ids;
        $this->db->where_in('id', $ids)->delete($this->tbl);
        return $this;
    }

    public function set($key, $data = null)
    {
        if(is_array($key)) {
            $this->setData = $key;
        } else {
            $this->setData[$key] = $data;
        }

        return $this;
    }
    public function get()
    {
        return $this->data;
    }

    public function get_one()
    {
        return isset($this->data[0]) ? $this->data[0] : false;
    }

    public function get_json($data = null)
    {
        $this->ret['data'] = $data ? $data : $this->data;
        return json_encode($this->ret);
    }

    public function set_limit($limit)
    {
        $this->limit = $limit;

        return $this;
    }

    public function set_page($page)
    {
        $this->page = $page;

        return $this;
    }

    public function set_sort($sort)
    {
        $this->sort = $sort;

        return $this;
    }
}
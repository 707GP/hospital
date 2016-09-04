package com.hrs.common;

public class IDGenerator {
	private long workerId;
	private long datacenterId;
	private long sequence = 0L;
	private long twepoch = 1288834974657L; // Thu, 04 Nov 2010 01:42:54 GMT
	private long workerIdBits = 5L; // �ڵ�ID����
	private long datacenterIdBits = 5L; // ��������ID����
	private long maxWorkerId = -1L ^ (-1L << workerIdBits); // ���֧�ֻ����ڵ���0~31��һ��32��
	private long maxDatacenterId = -1L ^ (-1L << datacenterIdBits); // ���֧���������Ľڵ���0~31��һ��32��
	private long sequenceBits = 12L; // ���к�12λ
	private long workerIdShift = sequenceBits; // �����ڵ�����12λ
	private long datacenterIdShift = sequenceBits + workerIdBits; // �������Ľڵ�����17λ
	private long timestampLeftShift = sequenceBits + workerIdBits + datacenterIdBits; // ʱ�����������22λ
	private long sequenceMask = -1L ^ (-1L << sequenceBits); // 4095
	private long lastTimestamp = -1L;

	private static class IdGenHolder {
		private static final IDGenerator instance = new IDGenerator();
	}

	public static IDGenerator get() {
		return IdGenHolder.instance;
	}

	public IDGenerator() {
		this(0L, 0L);
	}

	public IDGenerator(long workerId, long datacenterId) {
		if (workerId > maxWorkerId || workerId < 0) {
			throw new IllegalArgumentException(
					String.format("worker Id can't be greater than %d or less than 0", maxWorkerId));
		}
		if (datacenterId > maxDatacenterId || datacenterId < 0) {
			throw new IllegalArgumentException(
					String.format("datacenter Id can't be greater than %d or less than 0", maxDatacenterId));
		}
		this.workerId = workerId;
		this.datacenterId = datacenterId;
	}

	public synchronized long nextId() {
		long timestamp = timeGen(); // ��ȡ��ǰ������
		// ���������ʱ��������(ʱ�Ӻ���) ������
		if (timestamp < lastTimestamp) {
			throw new RuntimeException(String.format(
					"Clock moved backwards.  Refusing to generate id for %d milliseconds", lastTimestamp - timestamp));
		}
		// ����ϴ�����ʱ��͵�ǰʱ����ͬ,��ͬһ������
		if (lastTimestamp == timestamp) {
			// sequence��������Ϊsequenceֻ��12bit�����Ժ�sequenceMask����һ�£�ȥ����λ
			sequence = (sequence + 1) & sequenceMask;
			// �ж��Ƿ����,Ҳ����ÿ�����ڳ���4095����Ϊ4096ʱ����sequenceMask���룬sequence�͵���0
			if (sequence == 0) {
				timestamp = tilNextMillis(lastTimestamp); // �����ȴ�����һ����
			}
		} else {
			sequence = 0L; // ������ϴ�����ʱ�䲻ͬ,����sequence��������һ���뿪ʼ��sequence�������´�0��ʼ�ۼ�
		}
		lastTimestamp = timestamp;
		// ����չ���ƴ��ID��
		// 000000000000000000000000000000000000000000 00000 00000 000000000000
		// time datacenterId workerId sequence
		return ((timestamp - twepoch) << timestampLeftShift) | (datacenterId << datacenterIdShift)
				| (workerId << workerIdShift) | sequence;
	}

	protected long tilNextMillis(long lastTimestamp) {
		long timestamp = timeGen();
		while (timestamp <= lastTimestamp) {
			timestamp = timeGen();
		}
		return timestamp;
	}

	protected long timeGen() {
		return System.currentTimeMillis();
	}

}